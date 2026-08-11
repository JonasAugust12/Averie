## MODIFIED Requirements

### Requirement: Multi-step booking wizard

The system SHALL provide a client booking wizard that implements all Stitch booking steps (select service, employee, date, time, customer information, review, confirmation) using mock data only, and each step’s layout hierarchy and primary component composition MUST follow the corresponding Stitch HTML export for project `10694160950357827758` while remaining within Averie AppShell (max-width 1280px) and Averie theme tokens.

#### Scenario: Service step matches Stitch structure

- **WHEN** a visitor opens `/book` on step 1 after the fidelity pass
- **THEN** the UI MUST show step chrome, selectable service list/cards, and booking summary arrangement consistent with the Stitch “Select Service” screen (not a generic form-only layout)

#### Scenario: Happy path still mock-only

- **WHEN** a visitor completes all steps and confirms
- **THEN** the UI SHALL show confirmation with a mock reference and MUST NOT call booking APIs or write Mongo

### Requirement: Booking summary

While in the wizard, the UI SHALL show a booking summary reflecting current selections, positioned and styled consistently with the Stitch booking screens’ summary panel pattern.

#### Scenario: Summary updates with selection

- **WHEN** the visitor selects a service
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

### Requirement: Stitch-sourced booking implementation practice

Implementers MUST fetch Stitch HTML (and screenshot when available) for each booking screen before rewriting that step’s React components, and SHOULD prefer Tailwind canonical utility classes over equivalent arbitrary values.

#### Scenario: HTML reference saved

- **WHEN** a booking step is realigned
- **THEN** a corresponding HTML reference MUST be available under `docs/stitch/` (or an equivalent documented path) for that screen
