## ADDED Requirements

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

## MODIFIED Requirements

### Requirement: Mock credential submit

Login forms SHALL validate with Zod. Production salon admin/staff authentication MUST use Auth.js Credentials via `loginAction` when invoked; the existing UI mock gate MAY remain until a follow-up wire-up change replaces client-side mock redirects.

#### Scenario: Mock admin sign-in

- **WHEN** an operator submits valid mock admin credentials on `/admin/login` without UI wired to `loginAction`
- **THEN** the UI MAY still proceed via mock gate — this change does not require UI refactor

#### Scenario: Real login action against database

- **WHEN** `loginAction` is invoked with valid seeded admin credentials
- **THEN** the action MUST authenticate against MongoDB and return a successful Auth.js session envelope
