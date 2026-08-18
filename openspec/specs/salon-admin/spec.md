# salon-admin Specification

## Purpose

Stitch-aligned admin UI plus authenticated admin GET APIs and Server Actions for bookings, catalog CRUD, staff, and schedule settings.

## Requirements

### Requirement: Admin shell

The system SHALL provide an admin application shell under `/admin/*` with sidebar navigation to Dashboard, Bookings, Services, Employees, Schedule, and Settings, and the shell layout MUST follow the Stitch admin dashboard chrome (sidebar + header pattern) within Averie tokens and AppShell constraints.

#### Scenario: Navigate admin sections

- **WHEN** an operator uses the admin sidebar links
- **THEN** the app SHALL route to the corresponding admin pages without losing admin chrome

### Requirement: Admin overview

The admin overview page SHALL display KPI cards and today's schedule table using **live data** from `GET /api/admin/kpis` and booking/service/staff GET handlers, with structure consistent with the Stitch "Admin Dashboard - Overview" screen.

#### Scenario: Overview loads mock metrics

- **WHEN** an operator opens `/admin` with a valid admin session after integration
- **THEN** the UI MUST fetch KPI and schedule data from APIs and MUST NOT source metrics from `@/mocks/salon/data`

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

### Requirement: Admin i18n and Stitch refs

Admin UI strings SHALL use next-intl (EN default + VI). Implementers MUST fetch Stitch HTML per admin screen before rewriting that page, prefer Tailwind canonical classes, and store HTML under `docs/stitch/`.

#### Scenario: Admin HTML refs per page cluster

- **WHEN** an admin page cluster is marked done
- **THEN** corresponding Stitch HTML reference files MUST be present under `docs/stitch/`

### Requirement: Admin bookings read API

The system SHALL expose authenticated GET Route Handlers for paginated bookings list (`GET /api/bookings`) and booking detail (`GET /api/bookings/:id`) for admin role sessions, returning **enriched** booking DTOs with embedded `staff` and `services` summaries via lookup map enrichment.

#### Scenario: Unauthorized bookings list

- **WHEN** `GET /api/bookings` is called without an admin session
- **THEN** the handler MUST return status 401

#### Scenario: Paginated list shape

- **WHEN** an admin requests `GET /api/bookings?page=1&limit=20`
- **THEN** `data` MUST contain `{ items, total, page, limit }` where each item includes `staff` and `services` enrichment fields

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

The system SHALL provide `updateScheduleSettingsAction` to update the singleton `salon_settings` document fields (`allowStaffSelection`, `allowGuestLanguageSwitch`, `weekdaySchedules`, `dayOffs`, and other schedule settings fields).

The `salon_settings` document MAY also contain `promotion` fields updated by promotion Server Actions; schedule actions MUST NOT overwrite unrelated `promotion` fields when updating schedule data.

#### Scenario: Read then update settings

- **WHEN** an admin updates schedule settings
- **THEN** subsequent `GET /api/settings/schedule` MUST reflect the new values
- **AND** `GET /api/settings/promotion` MUST remain unchanged unless promotion was explicitly updated

### Requirement: Admin promotion settings page

The system SHALL provide an admin settings page at `/admin/settings/promotion` accessible to authenticated admins, using the shared AdminSettings layout and navigation tabs.

The page MUST allow operators to toggle promotion visibility (`enabled`), edit title and description, set optional start and end dates, toggle `hideAfterExpiry`, upload or replace the promotion image with preview, remove the image, and save changes with success feedback consistent with other admin settings pages.

#### Scenario: Open promotion settings

- **WHEN** an admin navigates to `/admin/settings/promotion`
- **THEN** the UI MUST display the current promotion settings loaded from `GET /api/settings/promotion`
- **AND** MUST show a Promotion tab as active in AdminSettingsNav

#### Scenario: Save promotion text fields

- **WHEN** an admin saves title, description, enabled, or date fields
- **THEN** `updatePromotionSettingsAction` MUST persist changes
- **AND** a success toast MUST be shown using existing admin toast patterns

#### Scenario: Replace image deletes old Cloudinary asset

- **WHEN** an admin uploads a new image while an existing `imagePublicId` is stored
- **THEN** the UI flow MUST invoke the upload action that replaces the image and deletes the prior Cloudinary asset per salon-promotion requirements

### Requirement: Staff calendar read

The system SHALL expose `GET /api/staff/:id/bookings` returning bookings for staff calendar views for authenticated admin or staff sessions per `docs/system-design/05-staff.md`.

#### Scenario: Staff sees assigned bookings

- **WHEN** a staff user requests their own staff id calendar endpoint
- **THEN** the response MUST include bookings where `staffId` matches or `staffPreference` is `any` per extended staff portal scope
