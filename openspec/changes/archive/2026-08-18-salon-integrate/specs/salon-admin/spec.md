## ADDED Requirements

### Requirement: Admin bookings server pagination UI

The admin bookings list page MUST fetch data via `GET /api/bookings` with server-side `page`, `limit`, `status`, `date`, and `search` query parameters and MUST render pagination controls bound to API `total`, `page`, and `limit` — not client-side slicing of a full in-memory array.

#### Scenario: Filter change refetches page 1

- **WHEN** an operator changes the status filter on `/admin/bookings`
- **THEN** the UI MUST reset to page 1 and MUST request the API with the new filter parameters

#### Scenario: Pagination uses API total

- **WHEN** the API returns `{ items, total: 42, page: 2, limit: 20 }`
- **THEN** the pagination footer MUST display counts derived from `total`, not `items.length` alone

### Requirement: Admin bookings enriched display

The admin bookings list and detail views MUST render service and staff labels from enriched booking DTO fields (`services[].name`, `staff.firstName`/`lastName`) without client-side joins against separate catalog queries.

#### Scenario: Table row shows service names

- **WHEN** a booking row renders in the admin table
- **THEN** it MUST display service names from `booking.services` on the DTO returned by `GET /api/bookings`

### Requirement: Admin skeleton loading

Admin pages that fetch remote salon data MUST render domain skeleton components while queries are loading.

#### Scenario: Dashboard loading

- **WHEN** `/admin` KPI or bookings queries are loading
- **THEN** the page MUST render `DashboardSkeleton` until data is available

#### Scenario: Services page loading

- **WHEN** `/admin/services` services query is loading
- **THEN** the page MUST render `ServicesGridSkeleton`

## MODIFIED Requirements

### Requirement: Admin overview

The admin overview page SHALL display KPI cards and today's schedule table using **live data** from `GET /api/admin/kpis` and booking/service/staff GET handlers, with structure consistent with the Stitch "Admin Dashboard - Overview" screen.

#### Scenario: Overview loads mock metrics

- **WHEN** an operator opens `/admin` with a valid admin session after integration
- **THEN** the UI MUST fetch KPI and schedule data from APIs and MUST NOT source metrics from `@/mocks/salon/data`

### Requirement: Bookings management UI

The system SHALL provide bookings list and booking detail pages using **API-backed** booking records with layouts consistent with Stitch Bookings List and Booking Details screens, with **server-side** filter and pagination on the list view.

#### Scenario: Open booking detail

- **WHEN** an operator selects a booking from the list
- **THEN** the UI MUST load detail via `GET /api/bookings/:id` (or enriched list item) and MUST show the Stitch-aligned detail composition

#### Scenario: Cancel booking via action

- **WHEN** an operator confirms cancel on an upcoming booking
- **THEN** the UI MUST call `cancelBookingAction` and MUST refresh the bookings query

### Requirement: Services and staff management UI

The system SHALL provide services and staff management screens that list entities from GET handlers and persist changes via Server Actions (not mock/in-memory), with layouts consistent with Stitch Service Management and Staff Management screens; staff schedule detail MUST align to Stitch Staff Schedule Details.

#### Scenario: View services list

- **WHEN** an operator opens `/admin/services`
- **THEN** the UI MUST list services from `GET /api/services` (admin session) with `name`, `price`, `estimatedMinutes`, and category in a Stitch-aligned management layout

#### Scenario: Delete service with confirm

- **WHEN** an operator confirms delete on a service
- **THEN** the UI MUST call `deleteServiceAction` after `showConfirm` and MUST invalidate services queries

### Requirement: Schedule admin UI

The system SHALL provide master schedule, shift management, and schedule settings pages driven by **`GET /api/settings/schedule`** and **`updateScheduleSettingsAction`**, and MUST follow Stitch Master Schedule, Shift Management, and Schedule Settings screen structures.

#### Scenario: Open schedule settings

- **WHEN** an operator opens `/admin/settings/schedule`
- **THEN** the UI MUST render schedule settings controls populated from the schedule GET handler in a Stitch-aligned settings layout

### Requirement: Admin bookings read API

The system SHALL expose authenticated GET Route Handlers for paginated bookings list (`GET /api/bookings`) and booking detail (`GET /api/bookings/:id`) for admin role sessions, returning **enriched** booking DTOs with embedded `staff` and `services` summaries via lookup map enrichment.

#### Scenario: Unauthorized bookings list

- **WHEN** `GET /api/bookings` is called without an admin session
- **THEN** the handler MUST return status 401

#### Scenario: Paginated list shape

- **WHEN** an admin requests `GET /api/bookings?page=1&limit=20`
- **THEN** `data` MUST contain `{ items, total, page, limit }` where each item includes `staff` and `services` enrichment fields

## REMOVED Requirements

_None._

## RENAMED Requirements

_None._
