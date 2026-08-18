# account-access Specification

## Purpose

Client and admin login UI (Stitch-aligned) plus Auth.js Credentials authentication for salon admin/staff backed by MongoDB users.

## Requirements

### Requirement: Client login UI

The system SHALL provide a client login page at `/login` whose layout and primary visual hierarchy MUST follow the Stitch "Client Login" HTML export, using Averie AppShell/theme tokens, without requiring production Auth.js salon client integration.

#### Scenario: Render Stitch-aligned client login

- **WHEN** a visitor opens `/login` after the fidelity pass
- **THEN** the page SHALL render login fields and submit control in a composition consistent with the Stitch Client Login screen

### Requirement: Admin login UI

The system SHALL provide an admin login page at `/admin/login` whose layout MUST follow the Stitch "Admin Login" HTML export for salon staff mock access.

#### Scenario: Render Stitch-aligned admin login

- **WHEN** a visitor opens `/admin/login` after the fidelity pass
- **THEN** the page SHALL render admin login fields and submit control consistent with the Stitch Admin Login screen

### Requirement: Route middleware protection

The system SHALL protect `/admin/*` (except `/admin/login`) and authenticated `/staff/*` routes via Next.js middleware that validates Auth.js session and user `role`.

#### Scenario: Unauthenticated admin access

- **WHEN** a visitor without a session opens `/admin/bookings`
- **THEN** middleware MUST redirect to `/admin/login`

#### Scenario: Staff blocked from admin

- **WHEN** a user with `role: staff` opens `/admin/services`
- **THEN** middleware MUST redirect away from admin routes

### Requirement: Admin and staff login wire-up

Admin login at `/admin/login` and staff login on `/staff` MUST invoke `loginAction` (Auth.js Credentials) on submit and MUST NOT use mock `sessionStorage` gates for authorization.

#### Scenario: Admin login success

- **WHEN** an operator submits valid admin credentials on `/admin/login`
- **THEN** the UI MUST call `loginAction`, establish session, and redirect to `/admin`

#### Scenario: Staff login success

- **WHEN** a staff user submits valid credentials on the staff portal login
- **THEN** the UI MUST call `loginAction` with redirect to `/staff` and MUST NOT authenticate via phone-only mock lookup

### Requirement: Mock credential submit

Login forms SHALL validate with react-hook-form and Zod. Production salon admin/staff authentication MUST use Auth.js Credentials via `loginAction` when login forms are submitted; mock client-side redirect gates MUST be removed from admin and staff shells.

#### Scenario: Mock admin sign-in

- **WHEN** an operator submits valid credentials on `/admin/login` after integration
- **THEN** the UI MUST authenticate via `loginAction` and MUST NOT set mock sessionStorage flags or use mock redirect gates

#### Scenario: Real login action against database

- **WHEN** `loginAction` is invoked with valid seeded admin credentials
- **THEN** the action MUST authenticate against MongoDB and return a successful Auth.js session envelope

### Requirement: Stitch-sourced login refs

Implementers MUST fetch Stitch HTML for Client Login and Admin Login before restyling those views, prefer Tailwind canonical classes, and keep EN/VI message catalogs for user-facing copy.

#### Scenario: Login HTML references present

- **WHEN** both login screens are realigned
- **THEN** HTML refs for Client Login and Admin Login MUST exist under `docs/stitch/`

### Requirement: Salon credentials authentication

The system SHALL authenticate admin and staff users via Auth.js Credentials provider against the MongoDB `users` collection using bcrypt password verification and JWT sessions.

#### Scenario: Valid admin login

- **WHEN** `loginAction` is called with valid admin email and password for an active user
- **THEN** Auth.js MUST establish a session with `role: admin` in the JWT payload

#### Scenario: Invalid password rejected

- **WHEN** login credentials do not match the stored hash
- **THEN** login MUST fail without revealing whether the email exists

#### Scenario: Inactive user blocked

- **WHEN** a user with `isActive: false` attempts login
- **THEN** authentication MUST fail with a generic error

### Requirement: Role-aware logout

The system SHALL provide `logoutAction` that clears the Auth.js session via `signOut()`.

#### Scenario: Logout clears session

- **WHEN** an authenticated user invokes `logoutAction`
- **THEN** subsequent protected API calls MUST return status 401

### Requirement: Password hashing

The system MUST hash passwords with bcrypt on user create and password reset Server Actions; plaintext passwords MUST NOT be stored.

#### Scenario: Staff password reset

- **WHEN** `resetStaffPasswordAction` succeeds
- **THEN** the new password MUST be stored only as `passwordHash`
