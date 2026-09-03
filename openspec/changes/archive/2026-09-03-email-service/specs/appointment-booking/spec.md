## MODIFIED Requirements

### Requirement: Customer form validation

The customer information step SHALL validate inputs with react-hook-form and Zod before allowing progression to review.

The email field MUST remain optional. The UI MUST display localized helper text encouraging the visitor to enter an email address to receive booking confirmation and reminder emails automatically.

#### Scenario: Missing required fields

- **WHEN** the visitor attempts to continue without required first name, last name, or phone
- **THEN** the form MUST block progression and show validation errors

#### Scenario: Email optional with guidance

- **WHEN** the customer information step renders
- **THEN** the email field MUST NOT be required
- **AND** MUST show helper text explaining that entering an email enables automatic confirmation and reminder emails

---

### Requirement: Create booking mutation

The system SHALL provide `createBookingAction` that validates input, verifies all `serviceIds` are `visible`, checks slot availability, generates a unique `reference`, persists an `upcoming` booking, and returns status 201 with the booking DTO.

Before slot and persistence checks, the action MUST verify public booking is enabled when the caller is not an authenticated admin. When `bookingEnabled` is `false` and the caller is not admin, the action MUST return status `403` and MUST NOT create a booking.

After a booking is successfully persisted, when `customer.email` is present, the action MUST trigger a booking confirmation email send. When `customer.email` is absent, the action MUST NOT send email. Email send failure MUST NOT cause the action to return an error status after the booking is persisted.

#### Scenario: Slot conflict on create

- **WHEN** `createBookingAction` is called for a date+time already booked as `upcoming` and public booking is enabled (or caller is admin)
- **THEN** it MUST return status 409 and MUST NOT create a duplicate booking

#### Scenario: Customer last name required

- **WHEN** create input omits `customer.lastName`
- **THEN** the action MUST return status 400 before persisting

#### Scenario: Public booking paused

- **WHEN** `createBookingAction` is called by a non-admin while `bookingEnabled` is `false`
- **THEN** it MUST return status `403` before persisting

#### Scenario: Admin booking while paused

- **WHEN** `createBookingAction` is called by an authenticated admin while `bookingEnabled` is `false`
- **THEN** it MUST NOT reject solely because of `bookingEnabled`

#### Scenario: Confirmation email when email provided

- **WHEN** a booking is created successfully and `customer.email` is non-empty
- **THEN** the system MUST send a confirmation email to that address
- **AND** MUST record `emailNotifications.confirmationSentAt` when send succeeds

#### Scenario: No email when address absent

- **WHEN** a booking is created successfully and `customer.email` is empty or omitted
- **THEN** the action MUST return status 201
- **AND** MUST NOT send a confirmation email
