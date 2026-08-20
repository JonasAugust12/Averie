## MODIFIED Requirements

### Requirement: OpenAPI spec for GET routes

The system SHALL use `next-openapi-gen` to generate an OpenAPI 3.x specification from App Router GET handlers in `src/app/api/**`, referencing Zod schemas exported from `@validations/*`. Generated documentation for booking GET routes MUST describe the current response DTOs, including aggregate booking stats and derived booking display state fields added to `GET /api/bookings`.

#### Scenario: Spec includes public booking reads

- **WHEN** the OpenAPI spec is generated after route handlers exist
- **THEN** it MUST document `GET /api/bookings/slots`, `GET /api/bookings/by-reference`, and other GET endpoints from `docs/system-design/09-api-actions.md`

#### Scenario: Spec includes bookings aggregate stats

- **WHEN** the OpenAPI spec is generated after the booking statistics change
- **THEN** the `bookingsListApiResponseSchema` documentation MUST show `data.stats.total`, `data.stats.upcoming`, `data.stats.cancelled`, and `data.stats.completed`

#### Scenario: Spec examples match booking list response

- **WHEN** a developer opens the Scalar docs for `GET /api/bookings`
- **THEN** the example response MUST include the `stats` object and any derived display status field returned on booking list items
