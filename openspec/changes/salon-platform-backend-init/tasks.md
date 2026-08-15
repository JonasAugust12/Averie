## 1. Dependencies and environment [db]

- [x] 1.1 [db] Add `bcryptjs`, `@types/bcryptjs`; add dev deps `next-openapi-gen`, `@scalar/nextjs-api-reference`
- [x] 1.2 [db] Add `ENABLE_API_DOCS=0` to `.env.example` with dev-only comment

## 2. Persistence layer [db]

- [x] 2.1 [db] Create `service-category.model.ts`, `service.model.ts`, `user.model.ts`, `booking.model.ts`, `salon-settings.model.ts` with indexes per system design
- [x] 2.2 [db] Create Zod schemas: `service-category.schema.ts`, `service.schema.ts`, `staff.schema.ts`, `booking.schema.ts`, `schedule-settings.schema.ts`
- [x] 2.3 [db] Implement `src/libs/salon.mapper.ts` (id map, date ISO, strip passwordHash)
- [x] 2.4 [db] Create `scripts/seed-salon.mjs` — admin user, singleton settings, 6 categories; add `pnpm db:seed` script

## 3. Shared server logic [db]

- [x] 3.1 [db] Implement `src/libs/schedule.server.ts` wrapping `schedule.util.ts` for server slot computation
- [x] 3.2 [db] Implement `src/libs/booking.service.ts` — reference generation, conflict check, totals from services

## 4. Authentication [auth]

- [x] 4.1 [auth] Wire Auth.js `authorize()` to `User` model + bcrypt in `auth.config.ts`
- [x] 4.2 [auth] Update `loginAction` / `logoutAction` for real Credentials flow; session payload `{ id, email, role, name }`
- [x] 4.3 [auth] Add auth guard helper for admin-only and staff/admin actions

## 5. Public GET Route Handlers [api]

- [x] 5.1 [api] `GET /api/service-categories`, `GET /api/services`, `GET /api/staff`, `GET /api/settings/schedule`
- [x] 5.2 [api] `GET /api/bookings/slots`, `GET /api/bookings/by-reference`

## 6. Admin GET Route Handlers [api]

- [x] 6.1 [api] `GET /api/bookings` (paginated + filters), `GET /api/bookings/[id]`
- [x] 6.2 [api] `GET /api/staff/[id]/bookings`
- [x] 6.3 [api] `GET /api/admin/kpis` (optional — skip if timeboxed)

## 7. Booking Server Actions [action]

- [x] 7.1 [action] `createBookingAction` — validate, slot check, persist, reference, 201/409/400
- [x] 7.2 [action] `cancelBookingAction`, `restoreBookingAction` — admin only, toggle status

## 8. Services Server Actions [action]

- [x] 8.1 [action] `createServiceCategoryAction`, `updateServiceCategoryAction`, `deleteServiceCategoryAction`
- [x] 8.2 [action] `createServiceAction`, `updateServiceAction`, `deleteServiceAction`, `toggleServiceVisibilityAction`

## 9. Staff Server Actions [action]

- [x] 9.1 [action] `createStaffAction`, `updateStaffAction`, `deleteStaffAction`, `resetStaffPasswordAction` (bcrypt on create/reset)

## 10. Settings Server Actions [action]

- [x] 10.1 [action] `updateScheduleSettingsAction` — update singleton salon_settings

## 11. API documentation [api]

- [x] 11.1 [api] Init `next-openapi-gen`; configure Zod schema scanning for `src/app/api/**`
- [x] 11.2 [api] Add JSDoc `@openapi` tags on GET route handlers referencing Zod schemas
- [x] 11.3 [api] Create `openapi/fragments/actions.yaml` for all Server Actions (doc-only pseudo-paths)
- [x] 11.4 [api] `GET /api/openapi.json` — serve merged spec; gate on `ENABLE_API_DOCS`
- [x] 11.5 [api] `GET /api/docs` — Scalar via `@scalar/nextjs-api-reference`; gate on `ENABLE_API_DOCS`

## 12. Verification [db]

- [x] 12.1 [db] Run seed against local Mongo; verify collections and admin login via `loginAction`
- [x] 12.2 [api] Manual smoke: public GET endpoints return envelope + canonical fields
- [x] 12.3 [action] Manual smoke: create booking → conflict on duplicate slot → cancel/restore
- [x] 12.4 [api] With `ENABLE_API_DOCS=1`, verify `/api/docs` loads; with `0`, verify 404
- [x] 12.5 [db] Run `pnpm type-check` and `pnpm lint` if many files touched
