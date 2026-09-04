## MODIFIED Requirements

### Requirement: Customer form validation

The customer information step SHALL validate inputs with react-hook-form and Zod before allowing progression to review.

The email field MUST remain optional. The UI MUST display localized helper text encouraging the visitor to enter an email address to receive booking confirmation and reminder emails automatically.

The UI MUST display localized helper text that a booking confirmation SMS will be sent to the phone number when it is a valid Vietnam mobile number.

#### Scenario: Missing required fields

- **WHEN** the visitor attempts to continue without required first name, last name, or phone
- **THEN** the form MUST block progression and show validation errors

#### Scenario: Email optional with guidance

- **WHEN** the customer information step renders
- **THEN** the email field MUST NOT be required
- **AND** MUST show helper text explaining that entering an email enables automatic confirmation and reminder emails

#### Scenario: Phone SMS guidance

- **WHEN** the customer information step renders
- **THEN** the UI MUST show helper text that confirmation SMS may be sent to the entered phone number for Vietnam mobile numbers

### Requirement: Booking create Server Action

The system SHALL provide `createBookingAction` that validates input, verifies all `serviceIds` are `visible`, checks slot availability, generates a unique `reference`, persists an `upcoming` booking, and returns status 201 with the booking DTO.

Before slot and persistence checks, the action MUST verify public booking is enabled when the caller is not an authenticated admin. When `bookingEnabled` is `false` and the caller is not admin, the action MUST return status `403` and MUST NOT create a booking.

After a booking is successfully persisted, when `customer.email` is present, the action MUST trigger a booking confirmation email send. When `customer.email` is absent, the action MUST NOT send email. Email send failure MUST NOT cause the action to return an error status after the booking is persisted.

After a booking is successfully persisted, when `customer.phone` normalizes to a valid Vietnam E.164 mobile number, the action MUST trigger a booking confirmation SMS send. When the phone does not normalize to Vietnam E.164, the action MUST NOT send SMS. SMS send failure MUST NOT cause the action to return an error status after the booking is persisted.

#### Scenario: Slot conflict on create

- **WHEN** `createBookingAction` is called for a date+time already booked as `upcoming` and public booking is enabled (or caller is admin)
- **THEN** it MUST return status 409 and MUST NOT create a duplicate booking

#### Scenario: Missing last name rejected

- **WHEN** create input omits `customer.lastName`
- **THEN** the action MUST return status 400

#### Scenario: Public booking disabled

- **WHEN** `createBookingAction` is called by a non-admin while `bookingEnabled` is `false`
- **THEN** it MUST return status 403 and MUST NOT persist a booking

#### Scenario: Admin booking when public disabled

- **WHEN** `createBookingAction` is called by an authenticated admin while `bookingEnabled` is `false`
- **THEN** it MUST persist the booking and MUST return status 201

#### Scenario: Confirmation email when email provided

- **WHEN** a booking is created successfully and `customer.email` is non-empty
- **THEN** the system MUST send a confirmation email to that address
- **AND** MUST record `emailNotifications.confirmationSentAt` when send succeeds

#### Scenario: No email when address absent

- **WHEN** a booking is created successfully and `customer.email` is empty or omitted
- **THEN** the action MUST return status 201
- **AND** MUST NOT send a confirmation email

#### Scenario: Confirmation SMS when VN phone provided

- **WHEN** a booking is created successfully and `customer.phone` normalizes to Vietnam E.164
- **THEN** the system MUST send a confirmation SMS to that E.164 number
- **AND** MUST record `smsNotifications.confirmationSentAt` when send succeeds

#### Scenario: No SMS when phone not VN

- **WHEN** a booking is created successfully and `customer.phone` does not normalize to Vietnam E.164
- **THEN** the action MUST return status 201
- **AND** MUST NOT send a confirmation SMS

#### Scenario: SMS failure does not fail booking

- **WHEN** a booking is persisted successfully and the confirmation SMS send fails
- **THEN** the action MUST still return status 201 with the booking DTO
- **AND** MUST NOT roll back the booking
