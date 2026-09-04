# salon-fe-data-layer Specification

## Purpose

Client data layer conventions for salon features: TanStack Query hooks under `@services/*`, toast error surfacing, skeleton loading states, direct DTO consumption, and destructive-action confirmation.

## Requirements

### Requirement: TanStack Query salon services

The system SHALL provide client hooks under `@services/*` that fetch GET Route Handlers via `apiClient` and invoke Server Actions for mutations, following the pattern in `src/services/booking.service.ts` with `unwrapApiResponse` and query invalidation on mutation success.

#### Scenario: GET uses apiClient envelope

- **WHEN** a hook such as `useServices()` runs its query function
- **THEN** it MUST call `apiClient.get` against `/api/*` and MUST unwrap `{ status, message, data }` via `unwrapApiResponse`

#### Scenario: Mutation uses Server Action

- **WHEN** a hook such as `useCreateBooking()` runs its mutation function
- **THEN** it MUST call the corresponding `@actions/*` function and MUST NOT use axios POST to Route Handlers

### Requirement: API error toast surfacing

The system SHALL install `react-toastify` and MUST display backend error messages from failed queries or mutations to the user via a shared toast helper.

#### Scenario: Action returns 400 envelope

- **WHEN** a Server Action returns `{ status: 400, message: 'Validation failed', data: null }`
- **THEN** the mutation hook MUST show the `message` text in a toast notification

#### Scenario: GET returns 401

- **WHEN** an authenticated GET returns HTTP 401
- **THEN** the client MUST surface an unauthorized toast or redirect per middleware without silently failing

### Requirement: Skeleton loading for remote data views

Every UI surface that fetches salon data via TanStack Query MUST render a domain-specific skeleton component while `isLoading` is true instead of a bare spinner or empty layout.

#### Scenario: Admin bookings loading

- **WHEN** `/admin/bookings` is opened and bookings query is loading
- **THEN** the page MUST render `BookingsTableSkeleton` (or equivalent) matching the table layout

#### Scenario: Booking wizard service step loading

- **WHEN** the service step query is loading
- **THEN** the step MUST render `ServicesGridSkeleton` until services data arrives

### Requirement: No client-side DTO mapping

Client components MUST consume API DTO field names directly (`visible`, `estimatedMinutes`, `firstName`, `lastName`, `staffPreference`, `serviceIds`) and MUST NOT introduce client mapper functions that rename API fields for display.

#### Scenario: Service card shows duration

- **WHEN** a service card renders duration from API data
- **THEN** it MUST read `estimatedMinutes` from the DTO, not map from `durationMin`

### Requirement: Destructive mutation confirmation

Client mutations that delete, cancel, hide, or otherwise irreversibly change salon entities MUST prompt the user with the global confirm popup before executing.

#### Scenario: Cancel booking

- **WHEN** an admin clicks cancel on an upcoming booking
- **THEN** the UI MUST call `useUIStore.showConfirm()` and MUST only invoke `cancelBookingAction` after confirmation

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
