## MODIFIED Requirements

### Requirement: Public booking catalog reads

The system SHALL expose GET Route Handlers for service categories, services, staff (`?visible=true`), and schedule settings used by the booking flow, returning the unified `{ status, message, data }` envelope with canonical DTO field names.

The `GET /api/service-categories` response MUST include nested services and MUST expose category marketing fields (`slug`, `subtitle`, `description`, `note`, `featured`) on each category DTO.

The booking wizard service step MUST render categories dynamically from the API response without hardcoded category slug metadata maps (e.g. legacy six-category `CAT_META` keys).

#### Scenario: Service categories include marketing fields

- **WHEN** a visitor calls `GET /api/service-categories`
- **THEN** each category in `data` MUST include `slug`, `subtitle`, `description`, `note`, and `featured`

#### Scenario: Booking shows all visible seeded categories

- **WHEN** the seed script has populated the twelve PDF categories
- **THEN** the booking service step MUST present all visible categories returned by the API
- **AND** MUST NOT depend on a fixed list of six legacy category identifiers

#### Scenario: Service step uses category icon from DTO

- **WHEN** the booking service step renders a category header
- **THEN** it MUST resolve the icon from the category `icon` field via Lucide
- **AND** MUST NOT require a hardcoded per-slug icon map in the component

#### Scenario: List visible staff for booking

- **WHEN** `GET /api/staff?visible=true` is called
- **THEN** the response MUST include only users with `role: staff`, `visible: true`, and `isActive: true`
