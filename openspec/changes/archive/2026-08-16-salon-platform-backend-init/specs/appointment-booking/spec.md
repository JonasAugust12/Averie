## ADDED Requirements

### Requirement: Public booking catalog reads

The system SHALL expose GET Route Handlers for service categories, services, staff (`?visible=true`), and schedule settings used by the booking flow, returning the unified `{ status, message, data }` envelope with canonical DTO field names.

#### Scenario: List visible staff for booking

- **WHEN** `GET /api/staff?visible=true` is called
- **THEN** the response MUST include only users with `role: staff`, `visible: true`, and `isActive: true`

### Requirement: Available slots read

The system SHALL expose `GET /api/bookings/slots?date=YYYY-MM-DD&serviceIds=...` that computes available time slots using salon settings and existing `upcoming` bookings with salon-level conflict rules (one booking per date+time).

#### Scenario: Booked slot excluded

- **WHEN** an upcoming booking exists for `date` and `time`
- **THEN** that time slot MUST NOT appear in the available slots response

### Requirement: Booking lookup by reference

The system SHALL expose `GET /api/bookings/by-reference?reference=AV-...` for confirmation lookup returning booking details without requiring customer authentication.

#### Scenario: Valid reference returns booking

- **WHEN** a valid booking reference is queried
- **THEN** the handler MUST return status 200 with booking DTO including `reference`, services summary, date, time, and customer fields

### Requirement: Create booking mutation

The system SHALL provide `createBookingAction` that validates input, verifies all `serviceIds` are `visible`, checks slot availability, generates a unique `reference`, persists an `upcoming` booking, and returns status 201 with the booking DTO.

#### Scenario: Slot conflict on create

- **WHEN** `createBookingAction` is called for a date+time already booked as `upcoming`
- **THEN** it MUST return status 409 and MUST NOT create a duplicate booking

#### Scenario: Customer last name required

- **WHEN** create input omits `customer.lastName`
- **THEN** the action MUST return status 400 before persisting

### Requirement: Booking response envelope

All booking Route Handlers and Server Actions in this capability MUST return `{ status: number, message: string, data: T | null }`.

#### Scenario: Successful slot query

- **WHEN** slots are computed successfully
- **THEN** `GET /api/bookings/slots` MUST return HTTP 200 with `data` containing available slot strings
