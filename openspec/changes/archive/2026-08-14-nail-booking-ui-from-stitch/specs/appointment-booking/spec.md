## ADDED Requirements

### Requirement: Multi-step booking wizard

The system SHALL provide a client booking wizard that implements all Stitch booking steps: select service, employee, date, time, customer information, review, and confirmation using mock data only (no booking API or Mongo writes).

#### Scenario: Complete happy path with mocks

- **WHEN** a visitor selects a service, employee, date, time, enters valid customer info, and confirms
- **THEN** the UI SHALL advance through each step and show a confirmation view with a mock reference identifier

### Requirement: Booking summary

While in the wizard, the UI SHALL show a booking summary reflecting the current selections (service, duration, price, and later employee/date/time as chosen).

#### Scenario: Service selection updates summary

- **WHEN** the visitor selects a service on the service step
- **THEN** the summary MUST display that service name, duration, and price from mock catalog data

### Requirement: Customer form validation

The customer information step SHALL validate inputs with react-hook-form and Zod before allowing progression to review.

#### Scenario: Missing required fields

- **WHEN** the visitor attempts to continue without required first name, last name, or phone
- **THEN** the form MUST block progression and show validation errors

### Requirement: Booking i18n

Booking wizard user-facing strings SHALL use next-intl with English default and Vietnamese translations.

#### Scenario: Step labels localized

- **WHEN** the wizard renders in `en` or `vi`
- **THEN** step titles and primary actions MUST resolve from message catalogs
