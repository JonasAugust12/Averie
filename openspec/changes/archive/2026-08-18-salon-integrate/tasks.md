## 1. Backend enrichment & OpenAPI [api] [db]

- [x] 1.1 [api] Add `BookingStaffSummaryDto`, `BookingServiceSummaryDto`, `BookingListItemDto` to `src/types/salon/booking.type.ts`
- [x] 1.2 [api] Create `src/libs/booking-enrich.server.ts` with lookup map + enrich helpers
- [x] 1.3 [api] Update `serializeBooking` / add `serializeBookingListItem` in `src/mappers/booking.mapper.ts`
- [x] 1.4 [api] Wire enrichment into `GET /api/bookings`, `[id]`, `by-reference`, `staff/[id]/bookings`
- [x] 1.5 [api] Update OpenAPI schemas/examples in `src/openapi/schemas/booking.schema.ts` and `examples/`
- [x] 1.6 [api] Run `pnpm openapi:gen` and verify Scalar docs show enriched fields

## 2. Client infrastructure [ui]

- [x] 2.1 [ui] Install `react-toastify` and mount `ToastContainer` in app providers
- [x] 2.2 [ui] Create `src/utils/toast.util.ts` with `toastApiError` / `toastSuccess`
- [x] 2.3 [ui] Create skeleton components under `src/components/shared/skeletons/` (bookings, services, staff, dashboard, slots, schedule, calendar)
- [x] 2.4 [ui] Export skeletons from `src/components/shared/index.ts`

## 3. Auth & route protection [auth]

- [x] 3.1 [auth] Add `src/middleware.ts` with admin/staff role checks
- [x] 3.2 [auth] Wire `/admin/login` to `useLogin` + `loginAction`; remove mock gate in `AdminShell.tsx`
- [x] 3.3 [auth] Wire `StaffPortalLogin.tsx` to `loginAction`; remove phone mock lookup
- [x] 3.4 [auth] Remove mock auth helpers from `src/stores/booking.store.ts` if present

## 4. Domain services layer [ui]

- [x] 4.1 [ui] Create `src/services/booking.service.ts` (list w/ filters, detail, by-reference, slots, create, cancel, restore)
- [x] 4.2 [ui] Create `src/services/service-catalog.service.ts` (categories, services CRUD hooks)
- [x] 4.3 [ui] Create `src/services/staff.service.ts` (staff CRUD, staff bookings GET)
- [x] 4.4 [ui] Create `src/services/schedule.service.ts` (settings read/update)
- [x] 4.5 [ui] Create `src/services/admin.service.ts` (KPIs)
- [x] 4.6 [ui] Convert `salon.service.ts` to re-export barrel; mark mock hooks deprecated

## 5. Customer booking flow [ui]

- [x] 5.1 [ui] Update `ServiceStep`, `EmployeeStep`, `DateStep`, `TimeStep` — API hooks + skeletons + DTO fields
- [x] 5.2 [ui] Update `BookingSummary`, `ReviewStep` — `createBookingAction`, `staffPreference`, `serviceIds`
- [x] 5.3 [ui] Update `ConfirmationPageView` — `useBookingByReference` enriched DTO
- [x] 5.4 [ui] Update `BookPageView` / `BookingChrome` — schedule settings from API
- [x] 5.5 [ui] Update `LandingSearchBooking` — by-reference lookup instead of mock scan

## 6. Admin catalog [ui] [action]

- [x] 6.1 [ui] Refactor `ServiceFormModal`, `CategoryFormModal` to RHF + Zod + mutation hooks + toast
- [x] 6.2 [ui] Refactor `StaffFormModal` to RHF + Zod + `createStaffAction`/`updateStaffAction`
- [x] 6.3 [ui] Wire `/admin/services` — API hooks, skeleton, confirm before delete/toggle visible
- [x] 6.4 [ui] Wire `/admin/staff` — API hooks, skeleton, confirm before delete
- [x] 6.5 [ui] Wire `/admin/settings/schedule` — RHF + `updateScheduleSettingsAction` + skeleton

## 7. Admin bookings & dashboard [ui]

- [x] 7.1 [ui] Rewrite `/admin/bookings` — server pagination/filters, enriched rows, cancel/restore actions, skeleton
- [x] 7.2 [ui] Update `/admin/bookings/[id]` — `useBooking(id)` enriched detail + skeleton
- [x] 7.3 [ui] Update `AdminNewBookingModal` — real create flow + slots API
- [x] 7.4 [ui] Wire `/admin` dashboard — KPIs + recent bookings from API + `DashboardSkeleton`
- [x] 7.5 [ui] Update `/admin/schedule` and `/admin/staff/[id]/schedule` — enriched bookings + skeletons

## 8. Staff portal [ui]

- [x] 8.1 [ui] Wire `/staff` — session gate, `GET /api/staff/:id/bookings`, calendar skeleton
- [x] 8.2 [ui] Update staff components to use enriched booking DTO fields

## 9. Type cleanup & mock removal [ui]

- [x] 9.1 [ui] Migrate component imports from `@typings/salon.type` mock types to `@typings/salon/*.type.ts`
- [x] 9.2 [ui] Remove runtime imports of `@/mocks/salon/data` from services and components
- [x] 9.3 [ui] Remove `completed` booking status from admin stats/filters (upcoming/cancelled only)

## 10. Verification [ui]

- [x] 10.1 Run `pnpm type-check` and fix all type errors
- [x] 10.2 Run `pnpm lint` on touched files
- [ ] 10.3 Manual happy path: customer book → admin list → cancel → staff calendar view
