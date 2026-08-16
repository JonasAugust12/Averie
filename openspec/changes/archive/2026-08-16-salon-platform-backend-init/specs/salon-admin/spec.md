## ADDED Requirements

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
