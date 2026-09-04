# salon-persistence Specification

## Purpose

MongoDB persistence layer for the salon domain: Mongoose models, Zod validation mirrors, indexes, seed data, and DTO mappers under `@mappers`.

## Requirements

### Requirement: Salon domain Mongoose models

The system SHALL define Mongoose 8 schemas for `ServiceCategory`, `Service`, `User`, `Booking`, and `SalonSettings` using collection names and field names from `docs/system-design/00-naming-conventions.md` and `02-domain-models.md`.

The `SalonSettings` schema MUST include `bookingEnabled` (boolean, default `true`) at the document root to control whether public online booking is accepted.

The `Booking` schema MUST include optional `emailNotifications` with `confirmationSentAt` and `reminderSentAt` Date fields to record transactional email send timestamps.

The `Booking` schema MUST include optional `smsNotifications` with `confirmationSentAt` Date field to record transactional SMS send timestamps.

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

#### Scenario: Booking email notification timestamps

- **WHEN** a booking document is created without prior email sends
- **THEN** `emailNotifications.confirmationSentAt` and `emailNotifications.reminderSentAt` MAY be unset
- **AND** existing bookings without these fields MUST remain valid without migration

#### Scenario: Confirmation timestamp persisted

- **WHEN** a confirmation email is successfully sent for a booking
- **THEN** the booking document MUST persist `emailNotifications.confirmationSentAt`

#### Scenario: Reminder timestamp persisted

- **WHEN** a reminder email is successfully sent for a booking via cron
- **THEN** the booking document MUST persist `emailNotifications.reminderSentAt`

#### Scenario: Booking SMS notification timestamps

- **WHEN** a booking document is created without prior SMS sends
- **THEN** `smsNotifications.confirmationSentAt` MAY be unset
- **AND** existing bookings without this field MUST remain valid without migration

#### Scenario: SMS confirmation timestamp persisted

- **WHEN** a confirmation SMS is successfully sent for a booking
- **THEN** the booking document MUST persist `smsNotifications.confirmationSentAt`

### Requirement: Zod validation mirrors

The system SHALL provide Zod 4 schemas in `@validations/*` that mirror each entity's create/update inputs with the same field names as Mongoose models.

#### Scenario: Server Action rejects invalid input

- **WHEN** a Server Action receives input that fails Zod `safeParse`
- **THEN** the action MUST return `{ status: 400, message, data: null }` without writing to the database

### Requirement: Database indexes

The system SHALL create indexes defined in `docs/system-design/02-domain-models.md`, including unique `users.email`, unique `bookings.reference`, and booking query indexes on `date`, `time`, and `status`.

#### Scenario: Duplicate booking reference rejected

- **WHEN** a second booking is created with an existing `reference` value
- **THEN** the create operation MUST fail with a conflict error (HTTP/action status 409)

### Requirement: Salon seed data

The system SHALL provide a seed script that creates a default admin user, a singleton `salon_settings` document, and six default service categories aligned with mock catalog names.

#### Scenario: Seed on empty database

- **WHEN** the seed script runs against an empty salon database
- **THEN** it MUST insert one admin user, one settings document, and six categories idempotently or skip if already present

### Requirement: Salon mapper serialization

The system SHALL implement serializers under `src/mappers/` (`@mappers`) to map `_id` to `id`, optional Date fields to ISO strings, and omit secrets — without renaming business fields.

#### Scenario: Service DTO field names

- **WHEN** a Service document is mapped for API output
- **THEN** the DTO MUST expose `visible` and `estimatedMinutes` (not `active` or `durationMin`)
