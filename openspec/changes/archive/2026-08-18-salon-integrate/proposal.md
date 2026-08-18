## Why

Salon UI is complete on mock data while the backend (MongoDB, Route Handlers, Server Actions, Auth.js) is already implemented. Without integration, operators and customers cannot use real bookings, admin CRUD, or authenticated portals. The mock type layer (`active`, `durationMin`, `staffId: 'any'`) also blocks alignment with canonical API DTOs. This change replaces the mock data layer with production API wiring so all three portals (customer, admin, staff) run on the same backend.

## What Changes

**Data layer**

- From: `salon.service.ts` reads/writes `@/mocks/salon/data`
- To: Domain `@services/*` modules call `apiClient` (GET) and Server Actions (mutations)
- Impact: Breaking for components using mock field names

**Booking API responses**

- From: `BookingDto` with only `serviceIds` and optional `staffId`
- To: List/detail DTOs include embedded `staff` summary and `services[]` summaries via server lookup map
- Reason: Admin/staff UI needs display names without client-side joins
- Impact: Non-breaking additive fields; OpenAPI + examples updated

**Admin bookings list**

- From: Client-side filter and pagination on full mock array
- To: Server-side `page`, `limit`, `status`, `date`, `search` on `GET /api/bookings`
- Impact: Admin bookings page behavior change (network round-trip per filter/page)

**Auth gates**

- From: Mock `sessionStorage` admin auth and staff phone lookup
- To: Auth.js session + `middleware.ts` role checks + `loginAction` on login forms
- Impact: Requires seeded admin/staff users for local dev

**UX infrastructure**

- Add `react-toastify` for BE error messages
- Add skeleton components for all data-fetching views
- Migrate admin forms to react-hook-form + Zod
- Confirm destructive mutations via existing `GlobalConfirmPopup`

**Types**

- Deprecate mock-centric `salon.type.ts` in runtime UI; use `@typings/salon/*.type.ts`

## Capabilities

### New Capabilities

- `salon-fe-data-layer`: Shared client infrastructure — toast errors, TanStack Query domain services, skeleton loading pattern, no client DTO mapping rule

### Modified Capabilities

- `appointment-booking`: Wizard and confirmation MUST use real GET handlers and `createBookingAction` instead of mock-only happy path
- `salon-admin`: Admin pages MUST use real APIs/actions; bookings list MUST use server pagination; overview MUST use real KPI/booking data
- `account-access`: Admin/staff login UI MUST invoke `loginAction`; routes MUST be protected by middleware

## Impact

**Backend**

- `src/libs/booking-enrich.server.ts` (new)
- `src/mappers/booking.mapper.ts`, booking route handlers, OpenAPI schemas/examples

**Frontend**

- `src/services/*`, all pages/components importing mock hooks (~25 files)
- `src/middleware.ts` (new)
- `src/components/**/Skeleton*.tsx` (new)
- `src/utils/toast.util.ts` (new)
- Admin form modals, `AdminShell`, `StaffPortalLogin`

**Dependencies**

- Add `react-toastify` (+ types if needed)

**Docs**

- OpenAPI generated spec + `openapi/fragments/actions.yaml` if action docs need updates

## Non-Goals

- OAuth providers, customer accounts, payment integration
- Zustand auth/token persistence
- Automated E2E suite
- UI layout redesign away from Stitch references
