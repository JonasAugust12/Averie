## Why

Salon operators sometimes need to pause online booking (maintenance, short closures, staffing gaps) without deploying code. Today `/book` is always active and `createBookingAction` accepts public submissions whenever slots exist. Operators must ask IT or accept bookings they cannot honor. A single admin-controlled toggle with a clear guest-facing “temporarily closed” overlay and server-side enforcement lets the salon control demand while admins can still enter bookings manually.

## What Changes

**Salon settings data**

- From: `SalonSettings` has schedule and promotion fields only.
- To: Root field `bookingEnabled` (boolean, default `true`).
- Reason: Minimal flag to pause public booking.
- Impact: Non-breaking; existing deployments default to accepting bookings.

**Schedule settings API and admin**

- From: Schedule settings manage hours, day-offs, staff selection flags.
- To: Same pipeline also reads/writes `bookingEnabled`; admin schedule page adds an “Online booking” toggle.
- Reason: Reuse existing settings pattern; no new tab for one boolean.
- Impact: Non-breaking API extension on `ScheduleSettingsDto`.

**Public booking UX**

- From: `/book` wizard always interactive.
- To: When `bookingEnabled` is false, full-viewport modal overlay (blur, blocked background clicks, responsive) with i18n closed copy.
- Reason: Clear guest communication per product request.
- Impact: Non-breaking when enabled (default).

**Public booking server guards**

- From: `createBookingAction` and slot reads only check availability/conflicts.
- To: Reject public callers with 403 when `bookingEnabled` is false; admin sessions bypass for manual booking.
- Reason: Prevent DevTools bypass of UI overlay.
- Impact: Public API behavior change only when toggle is off.

## Capabilities

### New Capabilities

- `salon-booking-availability`: Singleton `bookingEnabled` flag, public read via schedule settings, server guards for public booking mutations/reads, and booking-paused overlay UX.

### Modified Capabilities

- `appointment-booking`: Multi-step wizard MUST respect booking paused state; create booking mutation MUST reject non-admin callers when disabled.
- `salon-admin`: Schedule settings mutation and admin schedule page MUST expose `bookingEnabled` toggle.
- `salon-persistence`: `SalonSettings` model MUST persist `bookingEnabled` with default true.

## Impact

- **Models**: `src/models/salon-settings.model.ts`
- **Types/validation/mappers**: `schedule-settings.type.ts`, `schedule-settings.schema.ts`, `schedule.mapper.ts`
- **Server**: `schedule.server.ts`, `booking.action.ts`, `src/app/api/bookings/slots/route.ts`
- **UI**: `BookPageView.tsx`, new `BookingPausedOverlay.tsx`, `src/app/admin/settings/schedule/page.tsx`
- **i18n**: `messages/en|vi/booking.json`, `messages/en|vi/admin.json`
- **OpenAPI**: schedule settings response schema if convention requires

## Non-Goals

- Custom admin-editable closed message.
- Hiding landing “Book now” CTAs.
- Disabling booking lookup by reference/phone.
- Staff-portal booking bypass (only admin in v1).
- Auto-reopen scheduling.
