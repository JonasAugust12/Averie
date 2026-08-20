## MODIFIED Requirements

### Requirement: Admin bookings server pagination UI

The admin bookings list page MUST fetch data via `GET /api/bookings` with server-side `page`, `limit`, `status`, `date`, and `search` query parameters and MUST render pagination controls bound to API `total`, `page`, and `limit` -- not client-side slicing of a full in-memory array. The admin bookings list page MUST render booking statistic counts from aggregate values returned by the API, not by counting only the current paginated `items` array.

#### Scenario: Filter change refetches page 1

- **WHEN** an operator changes the status filter on `/admin/bookings`
- **THEN** the UI MUST reset to page 1 and MUST request the API with the new filter parameters

#### Scenario: Pagination uses API total

- **WHEN** the API returns `{ items, total: 42, page: 2, limit: 20 }`
- **THEN** the pagination footer MUST display counts derived from `total`, not `items.length` alone

#### Scenario: Statistic cards use aggregate API counts

- **WHEN** the API returns a page with `items.length` less than the full matching result set and `data.stats.upcoming` is greater than the number of upcoming rows on the current page
- **THEN** the upcoming statistic card and status tab MUST display `data.stats.upcoming`

### Requirement: Admin bookings read API

The system SHALL expose authenticated GET Route Handlers for paginated bookings list (`GET /api/bookings`) and booking detail (`GET /api/bookings/:id`) for admin role sessions, returning **enriched** booking DTOs with embedded `staff` and `services` summaries via lookup map enrichment. The paginated bookings list response MUST include aggregate statistics for all records matching the non-pagination filters, including `total`, `upcoming`, `cancelled`, and `completed`, where `completed` is derived from appointments with persisted `status: upcoming` whose scheduled date/time has passed in the salon timezone.

#### Scenario: Unauthorized bookings list

- **WHEN** `GET /api/bookings` is called without an admin session
- **THEN** the handler MUST return status 401

#### Scenario: Paginated list shape

- **WHEN** an admin requests `GET /api/bookings?page=1&limit=20`
- **THEN** `data` MUST contain `{ items, total, page, limit, stats }` where each item includes `staff` and `services` enrichment fields

#### Scenario: Stats count all filtered bookings

- **WHEN** an admin requests `GET /api/bookings?page=2&limit=8` and the matching dataset contains 30 bookings
- **THEN** `data.stats.total` MUST equal 30 even though `data.items` contains only the second page

#### Scenario: Completed stats are derived in salon time

- **WHEN** an upcoming booking's `date` and `time` are before the current `America/New_York` salon-local date/time
- **THEN** `GET /api/bookings` MUST count it under `data.stats.completed` instead of `data.stats.upcoming`

#### Scenario: Future upcoming stats exclude completed bookings

- **WHEN** the matching dataset contains one future upcoming booking and one past upcoming booking
- **THEN** `data.stats.upcoming` MUST count only the future upcoming booking
- **AND** `data.stats.completed` MUST count the past upcoming booking

### Requirement: Bookings management UI

The system SHALL provide bookings list and booking detail pages using **API-backed** booking records with layouts consistent with Stitch Bookings List and Booking Details screens, with **server-side** filter and pagination on the list view. The admin bookings UI MUST display a completed state for upcoming bookings whose scheduled salon-local time has passed, without requiring a database status mutation.

#### Scenario: Open booking detail

- **WHEN** an operator selects a booking from the list
- **THEN** the UI MUST load detail via `GET /api/bookings/:id` (or enriched list item) and MUST show the Stitch-aligned detail composition

#### Scenario: Cancel booking via action

- **WHEN** an operator confirms cancel on an upcoming booking
- **THEN** the UI MUST call `cancelBookingAction` and MUST refresh the bookings query

#### Scenario: Past upcoming row shows completed

- **WHEN** an admin bookings table row represents a booking with persisted `status: upcoming` and a derived completed display state
- **THEN** the row status badge MUST show the completed label and styling instead of the upcoming label
