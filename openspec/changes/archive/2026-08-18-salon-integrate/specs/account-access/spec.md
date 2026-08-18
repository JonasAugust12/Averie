## ADDED Requirements

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

## MODIFIED Requirements

### Requirement: Mock credential submit

Login forms SHALL validate with react-hook-form and Zod. Production salon admin/staff authentication MUST use Auth.js Credentials via `loginAction` when login forms are submitted; mock client-side redirect gates MUST be removed from admin and staff shells.

#### Scenario: Mock admin sign-in

- **WHEN** an operator submits valid credentials on `/admin/login` after integration
- **THEN** the UI MUST authenticate via `loginAction` and MUST NOT set mock sessionStorage flags or use mock redirect gates

#### Scenario: Real login action against database

- **WHEN** `loginAction` is invoked with valid seeded admin credentials
- **THEN** the action MUST authenticate against MongoDB and return a successful Auth.js session envelope

## REMOVED Requirements

_None._

## RENAMED Requirements

_None._
