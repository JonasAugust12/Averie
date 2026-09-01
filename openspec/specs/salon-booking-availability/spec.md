# salon-booking-availability Specification

## Purpose

Admin-configurable public online booking availability: persist `bookingEnabled`, expose it via schedule settings, block the booking wizard with a paused overlay, and enforce server-side guards when booking is disabled.

## Requirements

### Requirement: Public booking availability flag

The system SHALL persist `bookingEnabled` (boolean, default `true`) on the singleton `salon_settings` document at the root level (not nested under `promotion`).

When `bookingEnabled` is `false`, public online booking MUST be considered paused. When `true` or unset on legacy documents, public booking MUST behave as today.

#### Scenario: Default allows booking

- **WHEN** the singleton `salon_settings` document is created or lacks `bookingEnabled`
- **THEN** public booking MUST be treated as enabled
- **AND** `GET /api/settings/schedule` MUST return `bookingEnabled: true`

#### Scenario: Disabled pauses public booking

- **WHEN** an admin sets `bookingEnabled` to `false` and saves schedule settings
- **THEN** subsequent `GET /api/settings/schedule` MUST return `bookingEnabled: false`
- **AND** public booking flows MUST treat online booking as unavailable until re-enabled

---

### Requirement: Public booking paused overlay

When `bookingEnabled` is `false`, the booking wizard at `/book` MUST display a full-viewport modal overlay that:

- Covers the wizard with a semi-transparent blurred backdrop
- Shows localized title and body copy indicating online booking is temporarily unavailable
- Applies `pointer-events-none` (or equivalent) to the underlying wizard content so background controls are not clickable
- Uses `role="dialog"` and `aria-modal="true"` for accessibility
- Is responsive on mobile (readable card width, safe-area padding, adequate tap targets)
- MUST NOT provide a dismiss control that re-enables the wizard while booking remains disabled

#### Scenario: Guest opens book while paused

- **WHEN** a visitor navigates to `/book` and schedule settings report `bookingEnabled: false`
- **THEN** the overlay MUST be visible
- **AND** the visitor MUST NOT be able to complete wizard steps behind the overlay via normal interaction

#### Scenario: Guest opens book while enabled

- **WHEN** `bookingEnabled` is `true`
- **THEN** the overlay MUST NOT render
- **AND** the wizard MUST behave as before this change

---

### Requirement: Server enforcement when booking paused

When `bookingEnabled` is `false`, the system MUST reject **public** booking operations regardless of client UI state.

#### Scenario: Public create rejected

- **WHEN** `createBookingAction` is invoked by a non-admin caller while `bookingEnabled` is `false`
- **THEN** the action MUST return status `403`
- **AND** MUST NOT persist a booking

#### Scenario: Public slots rejected

- **WHEN** `GET /api/bookings/slots` is called while `bookingEnabled` is `false`
- **THEN** the handler MUST return status `403`
- **AND** MUST NOT return available slot times

#### Scenario: Admin create allowed while paused

- **WHEN** `createBookingAction` is invoked by an authenticated admin while `bookingEnabled` is `false`
- **THEN** the action MUST proceed with normal validation and MAY create a booking

---

### Requirement: Schedule settings expose booking flag

`GET /api/settings/schedule` MUST include `bookingEnabled` in the schedule settings DTO returned to clients.

`updateScheduleSettingsAction` MUST allow admins to update `bookingEnabled` together with other schedule fields without overwriting unrelated `promotion` subdocument fields.

#### Scenario: Read flag on schedule GET

- **WHEN** any client calls `GET /api/settings/schedule`
- **THEN** the response envelope MUST include `data.bookingEnabled` as a boolean
