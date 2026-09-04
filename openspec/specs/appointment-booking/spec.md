# appointment-booking Specification

## Purpose

Stitch-aligned multi-step booking wizard plus backend GET handlers and Server Actions for catalog reads, slot availability, and booking create/lookup.

## Requirements

### Requirement: Multi-step booking wizard

The system SHALL provide a client booking wizard that implements all Stitch booking steps (select service, employee, date, time, customer information, review, confirmation) using **live salon APIs** for catalog reads, slot availability, and booking creation, and each step's layout hierarchy and primary component composition MUST follow the corresponding Stitch HTML export for project `10694160950357827758` while remaining within Averie AppShell (max-width 1280px) and Averie theme tokens.

When schedule settings report `bookingEnabled: false`, the wizard MUST render the public booking paused overlay defined in salon-booking-availability and MUST NOT allow progression through booking steps via normal UI interaction.

#### Scenario: Service step matches Stitch structure

- **WHEN** a visitor opens `/book` on step 1 after integration and `bookingEnabled` is `true`
- **THEN** the UI MUST show step chrome, selectable service list/cards, and booking summary arrangement consistent with the Stitch "Select Service" screen (not a generic form-only layout)

#### Scenario: Wizard blocked when booking paused

- **WHEN** a visitor opens `/book` and `bookingEnabled` is `false`
- **THEN** the booking paused overlay MUST be shown per salon-booking-availability requirements
- **AND** the visitor MUST NOT interact with wizard steps behind the overlay

#### Scenario: Happy path still mock-only

- **WHEN** a visitor completes all steps and confirms after integration and `bookingEnabled` is `true`
- **THEN** the UI MUST call `createBookingAction`, MUST show confirmation with the returned `reference`, and MUST NOT read or write mock booking arrays

### Requirement: Booking summary

While in the wizard, the UI SHALL show a booking summary reflecting current selections from **API-backed** catalog data (`GET /api/services`, `GET /api/staff`, `GET /api/settings/schedule`), positioned and styled consistently with the Stitch booking screens' summary panel pattern.

#### Scenario: Summary updates with selection

- **WHEN** the visitor selects a service from `GET /api/services`
- **THEN** the summary MUST display that service `name`, `estimatedMinutes`, and `price` from the API DTO

### Requirement: Skeleton loading in booking wizard

Booking wizard steps that fetch catalog or slot data MUST show skeleton placeholders while queries are loading.

#### Scenario: Time step slots loading

- **WHEN** `useAvailableSlots(date)` is loading
- **THEN** the time step MUST render `TimeSlotsSkeleton` instead of an empty grid

### Requirement: Customer form validation

The customer information step SHALL validate inputs with react-hook-form and Zod before allowing progression to review.

The email field MUST remain optional. The UI MUST display localized helper text encouraging the visitor to enter an email address to receive booking confirmation and reminder emails automatically.

The UI MUST display localized helper text that a booking confirmation SMS will be sent to the phone number when it is a valid Vietnam mobile number.

#### Scenario: Missing required fields

- **WHEN** the visitor attempts to continue without required first name, last name, or phone
- **THEN** the form MUST block progression and show validation errors

#### Scenario: Email optional with guidance

- **WHEN** the customer information step renders
- **THEN** the email field MUST NOT be required
- **AND** MUST show helper text explaining that entering an email enables automatic confirmation and reminder emails

#### Scenario: Phone SMS guidance

- **WHEN** the customer information step renders
- **THEN** the UI MUST show helper text that confirmation SMS may be sent to the entered phone number for Vietnam mobile numbers

### Requirement: Booking i18n

Booking wizard user-facing strings SHALL use next-intl with English default and Vietnamese translations.

#### Scenario: Step labels localized

- **WHEN** the wizard renders in `en` or `vi`
- **THEN** step titles and primary actions MUST resolve from message catalogs

### Requirement: Stitch-sourced booking implementation practice

Implementers MUST fetch Stitch HTML (and screenshot when available) for each booking screen before rewriting that step's React components, and SHOULD prefer Tailwind canonical utility classes over equivalent arbitrary values.

#### Scenario: HTML reference saved

- **WHEN** a booking step is realigned
- **THEN** a corresponding HTML reference MUST be available under `docs/stitch/` (or an equivalent documented path) for that screen

### Requirement: Public booking catalog reads

The system SHALL expose GET Route Handlers for service categories, services, staff (`?visible=true`), and schedule settings used by the booking flow, returning the unified `{ status, message, data }` envelope with canonical DTO field names.

The `GET /api/service-categories` response MUST include nested services and MUST expose category marketing fields (`slug`, `subtitle`, `description`, `note`, `featured`) on each category DTO.

The booking wizard service step MUST render categories dynamically from the API response without hardcoded category slug metadata maps (e.g. legacy six-category `CAT_META` keys).

#### Scenario: Service categories include marketing fields

- **WHEN** a visitor calls `GET /api/service-categories`
- **THEN** each category in `data` MUST include `slug`, `subtitle`, `description`, `note`, and `featured`

#### Scenario: Booking shows all visible seeded categories

- **WHEN** the seed script has populated the twelve PDF categories
- **THEN** the booking service step MUST present all visible categories returned by the API
- **AND** MUST NOT depend on a fixed list of six legacy category identifiers

#### Scenario: Service step uses category icon from DTO

- **WHEN** the booking service step renders a category header
- **THEN** it MUST resolve the icon from the category `icon` field via Lucide
- **AND** MUST NOT require a hardcoded per-slug icon map in the component

#### Scenario: List visible staff for booking

- **WHEN** `GET /api/staff?visible=true` is called
- **THEN** the response MUST include only users with `role: staff`, `visible: true`, and `isActive: true`

### Requirement: Available slots read

The system SHALL expose `GET /api/bookings/slots?date=YYYY-MM-DD&serviceIds=...` that computes available time slots using salon settings and existing `upcoming` bookings with salon-level conflict rules (one booking per date+time).

When `bookingEnabled` is `false`, the handler MUST return status `403` and MUST NOT return slot data to public callers.

#### Scenario: Booked slot excluded

- **WHEN** an upcoming booking exists for `date` and `time` and `bookingEnabled` is `true`
- **THEN** that time slot MUST NOT appear in the available slots response

#### Scenario: Slots when booking enabled

- **WHEN** `GET /api/bookings/slots` is called with valid parameters and `bookingEnabled` is `true`
- **THEN** the handler MUST return available slots per schedule rules

#### Scenario: Slots when booking paused

- **WHEN** `GET /api/bookings/slots` is called while `bookingEnabled` is `false`
- **THEN** the handler MUST return status `403`

### Requirement: Booking list enrichment

Booking list and detail GET handlers that power admin, staff, or confirmation UI MUST enrich each booking with embedded `staff` and `services` summary objects using a server-side lookup map (load staff and service catalogs once per request, join in memory — not MongoDB populate per booking row).

#### Scenario: Admin list includes staff name

- **WHEN** an admin requests `GET /api/bookings?page=1&limit=20` and a booking has `staffPreference: specific` with a valid `staffId`
- **THEN** each item in `data.items` MUST include `staff: { id, firstName, lastName }` and `services: [{ id, name, estimatedMinutes }, ...]` matching `serviceIds`

#### Scenario: Any-staff booking omits staff object

- **WHEN** a booking has `staffPreference: any`
- **THEN** the enriched item MUST set `staff: null` and MUST still include the `services` array

### Requirement: Booking lookup by reference

The system SHALL expose `GET /api/bookings/by-reference?reference=AV-...` for confirmation lookup returning **enriched** booking details (including `services` summaries and `staff` when applicable) without requiring customer authentication.

#### Scenario: Valid reference returns booking

- **WHEN** a valid booking reference is queried
- **THEN** the handler MUST return status 200 with enriched booking DTO including `reference`, `services[]`, optional `staff`, `date`, `time`, and `customer` fields

### Requirement: Create booking mutation

The system SHALL provide `createBookingAction` that validates input, verifies all `serviceIds` are `visible`, checks slot availability, generates a unique `reference`, persists an `upcoming` booking, and returns status 201 with the booking DTO.

Before slot and persistence checks, the action MUST verify public booking is enabled when the caller is not an authenticated admin. When `bookingEnabled` is `false` and the caller is not admin, the action MUST return status `403` and MUST NOT create a booking.

After a booking is successfully persisted, when `customer.email` is present, the action MUST trigger a booking confirmation email send. When `customer.email` is absent, the action MUST NOT send email. Email send failure MUST NOT cause the action to return an error status after the booking is persisted.

After a booking is successfully persisted, when `customer.phone` normalizes to a valid Vietnam E.164 mobile number, the action MUST trigger a booking confirmation SMS send. When the phone does not normalize to Vietnam E.164, the action MUST NOT send SMS. SMS send failure MUST NOT cause the action to return an error status after the booking is persisted.

#### Scenario: Slot conflict on create

- **WHEN** `createBookingAction` is called for a date+time already booked as `upcoming` and public booking is enabled (or caller is admin)
- **THEN** it MUST return status 409 and MUST NOT create a duplicate booking

#### Scenario: Customer last name required

- **WHEN** create input omits `customer.lastName`
- **THEN** the action MUST return status 400 before persisting

#### Scenario: Public booking paused

- **WHEN** `createBookingAction` is called by a non-admin while `bookingEnabled` is `false`
- **THEN** it MUST return status `403` before persisting

#### Scenario: Admin booking while paused

- **WHEN** `createBookingAction` is called by an authenticated admin while `bookingEnabled` is `false`
- **THEN** it MUST NOT reject solely because of `bookingEnabled`

#### Scenario: Confirmation email when email provided

- **WHEN** a booking is created successfully and `customer.email` is non-empty
- **THEN** the system MUST send a confirmation email to that address
- **AND** MUST record `emailNotifications.confirmationSentAt` when send succeeds

#### Scenario: No email when address absent

- **WHEN** a booking is created successfully and `customer.email` is empty or omitted
- **THEN** the action MUST return status 201
- **AND** MUST NOT send a confirmation email

#### Scenario: Confirmation SMS when VN phone provided

- **WHEN** a booking is created successfully and `customer.phone` normalizes to Vietnam E.164
- **THEN** the system MUST send a confirmation SMS to that E.164 number
- **AND** MUST record `smsNotifications.confirmationSentAt` when send succeeds

#### Scenario: No SMS when phone not VN

- **WHEN** a booking is created successfully and `customer.phone` does not normalize to Vietnam E.164
- **THEN** the action MUST return status 201
- **AND** MUST NOT send a confirmation SMS

#### Scenario: SMS failure does not fail booking

- **WHEN** a booking is persisted successfully and the confirmation SMS send fails
- **THEN** the action MUST still return status 201 with the booking DTO
- **AND** MUST NOT roll back the booking

### Requirement: Booking response envelope

All booking Route Handlers and Server Actions in this capability MUST return `{ status: number, message: string, data: T | null }`.

#### Scenario: Successful slot query

- **WHEN** slots are computed successfully
- **THEN** `GET /api/bookings/slots` MUST return HTTP 200 with `data` containing available slot strings
