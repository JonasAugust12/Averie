## MODIFIED Requirements

### Requirement: Client login UI

The system SHALL provide a client login page at `/login` whose layout and primary visual hierarchy MUST follow the Stitch “Client Login” HTML export, using Averie AppShell/theme tokens, without requiring production Auth.js salon client integration.

#### Scenario: Render Stitch-aligned client login

- **WHEN** a visitor opens `/login` after the fidelity pass
- **THEN** the page SHALL render login fields and submit control in a composition consistent with the Stitch Client Login screen

### Requirement: Admin login UI

The system SHALL provide an admin login page at `/admin/login` whose layout MUST follow the Stitch “Admin Login” HTML export for salon staff mock access.

#### Scenario: Render Stitch-aligned admin login

- **WHEN** a visitor opens `/admin/login` after the fidelity pass
- **THEN** the page SHALL render admin login fields and submit control consistent with the Stitch Admin Login screen

### Requirement: Mock credential submit

Login forms SHALL validate with Zod and accept mock credentials or a client-side mock success path; they MUST NOT claim real session security for salon roles in this change.

#### Scenario: Mock admin sign-in

- **WHEN** an operator submits valid mock admin credentials on `/admin/login`
- **THEN** the UI SHALL proceed to the admin area via a mock gate without writing Mongo user records

### Requirement: Stitch-sourced login refs

Implementers MUST fetch Stitch HTML for Client Login and Admin Login before restyling those views, prefer Tailwind canonical classes, and keep EN/VI message catalogs for user-facing copy.

#### Scenario: Login HTML references present

- **WHEN** both login screens are realigned
- **THEN** HTML refs for Client Login and Admin Login MUST exist under `docs/stitch/`
