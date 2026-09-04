## ADDED Requirements

### Requirement: Server-side catalog fetch for landing

The system SHALL provide a server-only helper (e.g. `src/server/service-catalog.server.ts`) that loads visible service categories with nested visible services directly from MongoDB, returning the same DTO shape as `GET /api/service-categories` for public (non-admin) callers.

The home page Server Component MUST invoke this helper and pass the result as props to the landing page view / price list component for initial render.

#### Scenario: Landing receives catalog without client fetch on first paint

- **WHEN** the home page renders on the server
- **THEN** it MUST call the server catalog helper before rendering `LandingPriceList`
- **AND** MUST pass serialized category-with-services DTOs as props

#### Scenario: Server helper matches public API shape

- **WHEN** the server catalog helper returns data
- **THEN** each category MUST include `services[]` with the same field names as the public `GET /api/service-categories` response
- **AND** MUST exclude services where `visible` is false

#### Scenario: Admin session not required for landing fetch

- **WHEN** the server catalog helper runs for the public home page
- **THEN** it MUST NOT require an authenticated admin session
- **AND** MUST only include publicly visible services
