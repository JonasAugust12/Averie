## MODIFIED Requirements

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

---

### Requirement: Create booking mutation

The system SHALL provide `createBookingAction` that validates input, verifies all `serviceIds` are `visible`, checks slot availability, generates a unique `reference`, persists an `upcoming` booking, and returns status 201 with the booking DTO.

Before slot and persistence checks, the action MUST verify public booking is enabled when the caller is not an authenticated admin. When `bookingEnabled` is `false` and the caller is not admin, the action MUST return status `403` and MUST NOT create a booking.

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

---

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
