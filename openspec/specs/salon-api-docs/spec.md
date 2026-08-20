# salon-api-docs Specification

## Purpose

Developer-facing API documentation for salon GET Route Handlers and Server Actions via OpenAPI generation, YAML fragments, and Scalar UI gated by `ENABLE_API_DOCS`.

## Requirements

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
