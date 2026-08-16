## ADDED Requirements

### Requirement: OpenAPI spec for GET routes

The system SHALL use `next-openapi-gen` to generate an OpenAPI 3.x specification from App Router GET handlers in `src/app/api/**`, referencing Zod schemas exported from `@validations/*`.

#### Scenario: Spec includes public booking reads

- **WHEN** the OpenAPI spec is generated after route handlers exist
- **THEN** it MUST document `GET /api/bookings/slots`, `GET /api/bookings/by-reference`, and other GET endpoints from `docs/system-design/09-api-actions.md`

### Requirement: Server Action documentation fragments

The system SHALL maintain manual OpenAPI YAML fragments under `openapi/fragments/` describing Server Actions as documentation-only pseudo-paths tagged `Server Actions`, with a note that they are not public HTTP endpoints.

#### Scenario: Fragment describes create booking action

- **WHEN** a developer opens the merged OpenAPI spec
- **THEN** a path such as `/actions/createBooking` MUST document request/response shapes matching `createBookingAction` and state it is invoked via Server Action

### Requirement: Scalar API reference route

The system SHALL expose Scalar API reference at `GET /api/docs` and the merged spec at `GET /api/openapi.json`.

#### Scenario: Docs enabled in development

- **WHEN** `ENABLE_API_DOCS=1` and a developer requests `/api/docs`
- **THEN** the response MUST render the Scalar UI loading the OpenAPI spec

#### Scenario: Docs disabled by default

- **WHEN** `ENABLE_API_DOCS` is not `1`
- **THEN** `/api/docs` and `/api/openapi.json` MUST return 404

### Requirement: Environment documentation flag

The system SHALL document `ENABLE_API_DOCS` in `.env.example` with guidance to set `1` locally and leave unset in production.

#### Scenario: Example env file

- **WHEN** a developer copies `.env.example` to `.env.local`
- **THEN** they MUST find `ENABLE_API_DOCS=0` with a comment explaining dev-only usage
