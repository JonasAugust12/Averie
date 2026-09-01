## 1. Persistence and DTO layer [db]

- [x] 1.1 [db] Add `bookingEnabled` (boolean, default `true`) to `SalonSettings` schema in `src/models/salon-settings.model.ts`
- [x] 1.2 [db] Extend `ScheduleSettingsDto` with `bookingEnabled` in `src/types/schedule-settings.type.ts`
- [x] 1.3 [db] Add `bookingEnabled` to `updateScheduleSettingsSchema` in `src/validations/schedule-settings.schema.ts`
- [x] 1.4 [db] Map `bookingEnabled` in `serializeScheduleSettings` (`src/mappers/schedule.mapper.ts`), defaulting missing to `true`

## 2. Server helpers and guards [action] [api]

- [x] 2.1 [action] Add `isPublicBookingEnabled()` helper using `getSalonSettingsDocument()` in `src/server/schedule.server.ts`
- [x] 2.2 [action] Guard `createBookingAction` in `src/actions/booking.action.ts` — 403 for non-admin when disabled; admin bypass via `auth()` role check
- [x] 2.3 [api] Guard `GET /api/bookings/slots` in `src/app/api/bookings/slots/route.ts` — 403 when disabled
- [x] 2.4 [action] Ensure `updateScheduleSettingsAction` persists `bookingEnabled` without touching `promotion` fields

## 3. Booking paused overlay UI [ui]

- [x] 3.1 [ui] Create `src/components/booking/BookingPausedOverlay.tsx` — fixed overlay, blur backdrop, dialog a11y, mobile-responsive card, link home
- [x] 3.2 [ui] Export from `src/components/booking/index.ts`
- [x] 3.3 [ui] Integrate in `BookPageView.tsx` — when `settings?.bookingEnabled === false`, wrap wizard with `pointer-events-none` + blur on content, render overlay
- [x] 3.4 [ui] Add i18n keys to `messages/en/booking.json` and `messages/vi/booking.json` (`paused.title`, `paused.body`, `paused.ctaHome`)

## 4. Admin schedule settings toggle [ui] [auth]

- [x] 4.1 [ui] Add “Online booking” switch to `src/app/admin/settings/schedule/page.tsx` bound to `form.bookingEnabled`
- [x] 4.2 [ui] Add admin i18n keys in `messages/en/admin.json` and `messages/vi/admin.json` (`schedule.bookingEnabled`, `schedule.bookingEnabledDesc`)

## 5. OpenAPI and verification [api] [ui]

- [x] 5.1 [api] Update OpenAPI schedule settings schema if `scheduleSettingsApiResponseSchema` exists in `src/openapi/schemas/`
- [x] 5.2 [ui] Run `pnpm type-check` and `pnpm lint`
- [x] 5.3 [ui] Manual test: toggle off → `/book` shows overlay, slots 403, public create 403; admin modal still creates; toggle on → wizard works
