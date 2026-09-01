## MODIFIED Requirements

### Requirement: Salon domain Mongoose models

The system SHALL define Mongoose 8 schemas for `ServiceCategory`, `Service`, `User`, `Booking`, and `SalonSettings` using collection names and field names from `docs/system-design/00-naming-conventions.md` and `02-domain-models.md`.

The `SalonSettings` schema MUST include `bookingEnabled` (boolean, default `true`) at the document root to control whether public online booking is accepted.

#### Scenario: Collections use canonical names

- **WHEN** models are registered with Mongoose
- **THEN** collection names MUST be `service_categories`, `services`, `users`, `bookings`, and `salon_settings`
- **AND** business fields MUST use canonical names (`visible`, `estimatedMinutes`, `staffPreference`, `bookingEnabled`, etc.) without mock aliases

#### Scenario: User document excludes password in API paths

- **WHEN** a User document is serialized for any API or action response
- **THEN** `passwordHash` MUST NOT appear in the output DTO

#### Scenario: Booking enabled default

- **WHEN** a new `salon_settings` document is created without explicit `bookingEnabled`
- **THEN** `bookingEnabled` MUST default to `true`
