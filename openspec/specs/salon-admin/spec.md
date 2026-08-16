# salon-admin Specification

## Purpose

Stitch-aligned admin UI (mock-backed) plus authenticated admin GET APIs and Server Actions for bookings, catalog CRUD, staff, and schedule settings.

## Requirements

### Requirement: Admin shell

The system SHALL provide an admin application shell under `/admin/*` with sidebar navigation to Dashboard, Bookings, Services, Employees, Schedule, and Settings, and the shell layout MUST follow the Stitch admin dashboard chrome (sidebar + header pattern) within Averie tokens and AppShell constraints.

#### Scenario: Navigate admin sections

- **WHEN** an operator uses the admin sidebar links
- **THEN** the app SHALL route to the corresponding admin pages without losing admin chrome

### Requirement: Admin overview

The admin overview page SHALL display mock KPI cards and today's schedule table with structure consistent with the Stitch "Admin Dashboard - Overview" screen.

#### Scenario: Overview loads mock metrics

- **WHEN** an operator opens `/admin`
- **THEN** the UI SHALL show mock appointment/pending/revenue/tech metrics and a schedule list sourced from mocks in a layout consistent with Stitch overview hierarchy

### Requirement: Bookings management UI

The system SHALL provide bookings list and booking detail pages using mock booking records, with layouts consistent with Stitch Bookings List and Booking Details screens (client-side filter/search on mock arrays is acceptable).

#### Scenario: Open booking detail

- **WHEN** an operator selects a booking from the list
- **THEN** the UI SHALL show the booking detail view for that mock id with a Stitch-aligned detail composition

### Requirement: Services and staff management UI

The system SHALL provide services and staff management screens that list mock entities and expose add/edit UI controls (mock/in-memory only), with layouts consistent with Stitch Service Management and Staff Management screens; staff schedule detail MUST align to Stitch Staff Schedule Details.

#### Scenario: View services list

- **WHEN** an operator opens `/admin/services`
- **THEN** the UI SHALL list mock services with name, price, duration, and category in a Stitch-aligned management layout

### Requirement: Schedule admin UI

The system SHALL provide master schedule, shift management, and schedule settings pages driven by mock data and MUST follow Stitch Master Schedule, Shift Management, and Schedule Settings screen structures.

#### Scenario: Open schedule settings

- **WHEN** an operator opens `/admin/settings/schedule`
- **THEN** the UI SHALL render schedule settings controls populated from mocks in a Stitch-aligned settings layout

### Requirement: Admin i18n and Stitch refs

Admin UI strings SHALL use next-intl (EN default + VI). Implementers MUST fetch Stitch HTML per admin screen before rewriting that page, prefer Tailwind canonical classes, and store HTML under `docs/stitch/`.

#### Scenario: Admin HTML refs per page cluster

- **WHEN** an admin page cluster is marked done
- **THEN** corresponding Stitch HTML reference files MUST be present under `docs/stitch/`

### Requirement: Admin bookings read API

The system SHALL expose authenticated GET Route Handlers for paginated bookings list (`GET /api/bookings`) and booking detail (`GET /api/bookings/:id`) for admin role sessions, supporting filters documented in `docs/system-design/07-admin-bookings.md`.

#### Scenario: Unauthorized bookings list

- **WHEN** `GET /api/bookings` is called without an admin session
- **THEN** the handler MUST return status 401

#### Scenario: Paginated list shape

- **WHEN** an admin requests `GET /api/bookings?page=1&limit=20`
- **THEN** `data` MUST contain `{ items, total, page, limit }`

### Requirement: Booking cancel and restore mutations

The system SHALL provide `cancelBookingAction` and `restoreBookingAction` that toggle booking `status` between `upcoming` and `cancelled`, setting or clearing `cancelledAt`.

#### Scenario: Cancel upcoming booking

- **WHEN** an admin invokes `cancelBookingAction` on an upcoming booking
- **THEN** the booking MUST have `status: cancelled` and `cancelledAt` set

### Requirement: Service category CRUD mutations

The system SHALL provide Server Actions to create, update, and delete service categories, restricted to admin role.

#### Scenario: Create category

- **WHEN** an admin calls `createServiceCategoryAction` with a valid name
- **THEN** the action MUST return status 201 with the new category DTO

### Requirement: Service CRUD mutations

The system SHALL provide Server Actions to create, update, delete services, and toggle service visibility (`visible`), restricted to admin role.

#### Scenario: Hide service from public catalog

- **WHEN** an admin calls `toggleServiceVisibilityAction` on a visible service
- **THEN** the service MUST have `visible: false` and MUST NOT appear in public `GET /api/services` for booking

### Requirement: Staff CRUD mutations

The system SHALL provide Server Actions to create, update, delete staff users (`role: staff`), and reset staff passwords, restricted to admin role.

#### Scenario: Create staff with credentials

- **WHEN** an admin creates a staff user via `createStaffAction`
- **THEN** the system MUST persist `passwordHash` (bcrypt) and MUST NOT return the hash in the response

### Requirement: Schedule settings mutation

The system SHALL provide `updateScheduleSettingsAction` to update the singleton `salon_settings` document fields (`allowStaffSelection`, `workingWeekdays`, `periodSlots`, `dayOffs`).

#### Scenario: Read then update settings

- **WHEN** an admin updates schedule settings
- **THEN** subsequent `GET /api/settings/schedule` MUST reflect the new values

### Requirement: Staff calendar read

The system SHALL expose `GET /api/staff/:id/bookings` returning bookings for staff calendar views for authenticated admin or staff sessions per `docs/system-design/05-staff.md`.

#### Scenario: Staff sees assigned bookings

- **WHEN** a staff user requests their own staff id calendar endpoint
- **THEN** the response MUST include bookings where `staffId` matches or `staffPreference` is `any` per extended staff portal scope
