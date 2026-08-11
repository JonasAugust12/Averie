## ADDED Requirements

### Requirement: Admin shell

The system SHALL provide an admin application shell under `/admin/*` with sidebar navigation to Dashboard, Bookings, Services, Employees, Schedule, and Settings, styled with Averie tokens inside AppShell constraints.

#### Scenario: Navigate admin sections

- **WHEN** an operator uses the admin sidebar links
- **THEN** the app SHALL route to the corresponding admin pages without full-page loss of the admin chrome

### Requirement: Admin overview

The admin overview page SHALL display mock KPI cards and today’s schedule table consistent with the Stitch overview screen structure.

#### Scenario: Overview loads mock metrics

- **WHEN** an operator opens `/admin`
- **THEN** the UI SHALL show mock appointment/pending/revenue/tech metrics and a schedule list sourced from mocks

### Requirement: Bookings management UI

The system SHALL provide bookings list and booking detail pages using mock booking records, including filters/search affordances present in the Stitch designs (behavioral filtering may be client-side on mock arrays).

#### Scenario: Open booking detail

- **WHEN** an operator selects a booking from the list
- **THEN** the UI SHALL show the booking detail view for that mock id

### Requirement: Services and staff management UI

The system SHALL provide services and staff management screens that list mock entities and expose add/edit UI controls (persisting only to mock/in-memory state for this change).

#### Scenario: View services list

- **WHEN** an operator opens `/admin/services`
- **THEN** the UI SHALL list mock services with name, price, duration, and category

### Requirement: Schedule admin UI

The system SHALL provide master schedule, staff schedule detail, shift management, and schedule settings pages driven by mock data.

#### Scenario: Open schedule settings

- **WHEN** an operator opens `/admin/settings/schedule`
- **THEN** the UI SHALL render schedule settings controls populated from mocks

### Requirement: Admin i18n

Admin UI strings introduced by this change SHALL use next-intl with English default and Vietnamese translations.

#### Scenario: Sidebar labels localized

- **WHEN** the admin shell renders in `en` or `vi`
- **THEN** sidebar labels MUST resolve from message catalogs
