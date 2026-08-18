## ADDED Requirements

### Requirement: Booking list enrichment

Booking list and detail GET handlers that power admin, staff, or confirmation UI MUST enrich each booking with embedded `staff` and `services` summary objects using a server-side lookup map (load staff and service catalogs once per request, join in memory — not MongoDB populate per booking row).

#### Scenario: Admin list includes staff name

- **WHEN** an admin requests `GET /api/bookings?page=1&limit=20` and a booking has `staffPreference: specific` with a valid `staffId`
- **THEN** each item in `data.items` MUST include `staff: { id, firstName, lastName }` and `services: [{ id, name, estimatedMinutes }, ...]` matching `serviceIds`

#### Scenario: Any-staff booking omits staff object

- **WHEN** a booking has `staffPreference: any`
- **THEN** the enriched item MUST set `staff: null` and MUST still include the `services` array

### Requirement: Skeleton loading in booking wizard

Booking wizard steps that fetch catalog or slot data MUST show skeleton placeholders while queries are loading.

#### Scenario: Time step slots loading

- **WHEN** `useAvailableSlots(date)` is loading
- **THEN** the time step MUST render `TimeSlotsSkeleton` instead of an empty grid

## MODIFIED Requirements

### Requirement: Multi-step booking wizard

The system SHALL provide a client booking wizard that implements all Stitch booking steps (select service, employee, date, time, customer information, review, confirmation) using **live salon APIs** for catalog reads, slot availability, and booking creation, and each step's layout hierarchy and primary component composition MUST follow the corresponding Stitch HTML export for project `10694160950357827758` while remaining within Averie AppShell (max-width 1280px) and Averie theme tokens.

#### Scenario: Service step matches Stitch structure

- **WHEN** a visitor opens `/book` on step 1 after integration
- **THEN** the UI MUST show step chrome, selectable service list/cards, and booking summary arrangement consistent with the Stitch "Select Service" screen (not a generic form-only layout)

#### Scenario: Happy path still mock-only

- **WHEN** a visitor completes all steps and confirms after integration
- **THEN** the UI MUST call `createBookingAction`, MUST show confirmation with the returned `reference`, and MUST NOT read or write mock booking arrays

### Requirement: Booking summary

While in the wizard, the UI SHALL show a booking summary reflecting current selections from **API-backed** catalog data (`GET /api/services`, `GET /api/staff`, `GET /api/settings/schedule`), positioned and styled consistently with the Stitch booking screens' summary panel pattern.

#### Scenario: Summary updates with selection

- **WHEN** the visitor selects a service from `GET /api/services`
- **THEN** the summary MUST display that service `name`, `estimatedMinutes`, and `price` from the API DTO

### Requirement: Booking lookup by reference

The system SHALL expose `GET /api/bookings/by-reference?reference=AV-...` for confirmation lookup returning **enriched** booking details (including `services` summaries and `staff` when applicable) without requiring customer authentication.

#### Scenario: Valid reference returns booking

- **WHEN** a valid booking reference is queried
- **THEN** the handler MUST return status 200 with enriched booking DTO including `reference`, `services[]`, optional `staff`, `date`, `time`, and `customer` fields

## REMOVED Requirements

_None._

## RENAMED Requirements

_None._
