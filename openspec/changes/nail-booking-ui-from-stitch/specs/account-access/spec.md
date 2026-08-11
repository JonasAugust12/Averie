## ADDED Requirements

### Requirement: Client login UI

The system SHALL provide a client login page UI at `/login` matching the Stitch client login structure, using Averie AppShell/theme, without requiring a production Auth.js salon client integration in this change.

#### Scenario: Render client login

- **WHEN** a visitor opens `/login`
- **THEN** the page SHALL render login fields and a submit control

### Requirement: Admin login UI

The system SHALL provide an admin login page UI at `/admin/login` aligned to the Stitch admin login screen for salon staff mock access.

#### Scenario: Render admin login

- **WHEN** a visitor opens `/admin/login`
- **THEN** the page SHALL render admin login fields and a submit control

### Requirement: Mock credential submit

Login forms SHALL validate with Zod and accept mock credentials or a client-side mock success path; they MUST NOT claim real session security for salon roles in this change.

#### Scenario: Mock admin sign-in

- **WHEN** an operator submits valid mock admin credentials on `/admin/login`
- **THEN** the UI SHALL proceed to the admin area via a mock gate (e.g., client flag/redirect) without writing Mongo user records
