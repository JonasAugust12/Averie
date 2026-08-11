## MODIFIED Requirements

### Requirement: Admin shell

The system SHALL provide an admin application shell under `/admin/*` with sidebar navigation to Dashboard, Bookings, Services, Employees, Schedule, and Settings, and the shell layout MUST follow the Stitch admin dashboard chrome (sidebar + header pattern) within Averie tokens and AppShell constraints.

#### Scenario: Navigate admin sections

- **WHEN** an operator uses the admin sidebar links
- **THEN** the app SHALL route to the corresponding admin pages without losing admin chrome

### Requirement: Admin overview

The admin overview page SHALL display mock KPI cards and today’s schedule table with structure consistent with the Stitch “Admin Dashboard - Overview” screen.

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
