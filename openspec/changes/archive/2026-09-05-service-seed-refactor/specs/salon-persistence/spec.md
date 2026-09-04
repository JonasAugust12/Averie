## MODIFIED Requirements

### Requirement: Salon domain Mongoose models

The system SHALL define Mongoose 8 schemas for `ServiceCategory`, `Service`, `User`, `Booking`, and `SalonSettings` using collection names and field names from `docs/system-design/00-naming-conventions.md` and `02-domain-models.md`.

The `SalonSettings` schema MUST include `bookingEnabled` (boolean, default `true`) at the document root to control whether public online booking is accepted.

The `Booking` schema MUST include optional `emailNotifications` with `confirmationSentAt` and `reminderSentAt` Date fields to record transactional email send timestamps.

The `Booking` schema MUST include optional `smsNotifications` with `confirmationSentAt` Date field to record transactional SMS send timestamps.

The `ServiceCategory` schema MUST include the following fields in addition to existing `name`, `sortOrder`, and `icon`:

- `slug` (string, required, trim, lowercase kebab-case, unique index)
- `subtitle` (string, optional, trim, default empty)
- `description` (string, optional, trim, default empty)
- `note` (string, optional, trim, default empty)
- `featured` (boolean, default false)

#### Scenario: Collections use canonical names

- **WHEN** models are registered with Mongoose
- **THEN** collection names MUST be `service_categories`, `services`, `users`, `bookings`, and `salon_settings`
- **AND** business fields MUST use canonical names (`visible`, `estimatedMinutes`, `staffPreference`, `bookingEnabled`, `slug`, `featured`, etc.) without mock aliases

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

#### Scenario: Service category slug uniqueness

- **WHEN** two service categories are created with the same `slug`
- **THEN** the second create MUST fail with a conflict error

### Requirement: Salon seed data

The system SHALL provide a seed script that creates a default admin user, a singleton `salon_settings` document, and **twelve** service categories aligned with the salon PDF menu (Signature, Dessert, Me Time, Gentlemen, Little Diva, Gel Polish, Add-ons, Waxing, Acrylic, Dip, Builder, Facials).

The seed script MUST load category and service definitions from `scripts/data/salon-menu.mjs` and upsert categories by `slug` and services by `(categorySlug, name)`.

The seed script MUST insert approximately **fifty-five** services with `name`, `description`, `price`, and `estimatedMinutes` derived from the PDF menu, estimating duration when the PDF omits it.

After upserting the canonical menu, the seed script MUST remove service categories whose `slug` is not present in `salon-menu.mjs` and MUST delete services belonging to removed categories.

Sample bookings in the seed script MUST reference service names that exist in the seeded catalog.

#### Scenario: Seed on empty database

- **WHEN** the seed script runs against an empty salon database
- **THEN** it MUST insert one admin user, one settings document, twelve categories, and the full service menu idempotently or skip if already present

#### Scenario: Re-seed replaces obsolete placeholder categories

- **WHEN** the seed script runs against a database containing legacy six-category placeholder data
- **THEN** it MUST upsert all twelve PDF categories and MUST remove categories not defined in `salon-menu.mjs`

#### Scenario: Service seed includes estimated minutes

- **WHEN** the seed script inserts a service from `salon-menu.mjs`
- **THEN** the service document MUST include `estimatedMinutes` ≥ 1

### Requirement: Salon mapper serialization

The system SHALL implement serializers under `src/mappers/` (`@mappers`) to map `_id` to `id`, optional Date fields to ISO strings, and omit secrets — without renaming business fields.

The `ServiceCategory` DTO MUST expose `slug`, `subtitle`, `description`, `note`, and `featured` in addition to existing fields.

#### Scenario: Service DTO field names

- **WHEN** a Service document is mapped for API output
- **THEN** the DTO MUST expose `visible` and `estimatedMinutes` (not `active` or `durationMin`)

#### Scenario: Service category DTO includes marketing fields

- **WHEN** a ServiceCategory document is mapped for API output
- **THEN** the DTO MUST expose `slug`, `subtitle`, `description`, `note`, and `featured`
