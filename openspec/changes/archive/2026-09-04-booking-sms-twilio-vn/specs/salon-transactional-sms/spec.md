## ADDED Requirements

### Requirement: Twilio SMS provider configuration

The system SHALL send transactional booking SMS through the Twilio Programmable Messaging API using server-only credentials.

When `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, or `TWILIO_SMS_FROM` is missing or empty, SMS send helpers MUST log a warning and MUST NOT throw during booking create; booking persistence MUST remain unaffected.

When `SMS_ENABLED` is explicitly set to `false`, the system MUST skip all SMS sends regardless of other Twilio env vars.

#### Scenario: Send with valid credentials

- **WHEN** Twilio env vars are configured and a send helper is invoked with a valid E.164 recipient
- **THEN** the system MUST call Twilio to deliver the SMS from `TWILIO_SMS_FROM`
- **AND** MUST return success when Twilio accepts the message

#### Scenario: Missing credentials in development

- **WHEN** required Twilio env vars are not set and a send helper is invoked
- **THEN** the helper MUST skip the external API call
- **AND** MUST log that SMS is disabled

#### Scenario: SMS explicitly disabled

- **WHEN** `SMS_ENABLED=false` and a send helper is invoked
- **THEN** the helper MUST NOT call Twilio

### Requirement: Vietnam E.164 phone normalization

The system SHALL provide a server-side normalizer that converts booking phone input into Vietnam E.164 format (`+84` followed by 9 mobile digits) when the input represents a valid Vietnam mobile number.

The normalizer MUST accept common local formats including leading `0`, leading `84` without `+`, and `+84`.

When input cannot be normalized to a valid Vietnam mobile E.164 number, the normalizer MUST return null and MUST NOT throw.

#### Scenario: Local format with leading zero

- **WHEN** phone input is `0912345678`
- **THEN** the normalizer MUST return `+84912345678`

#### Scenario: International format without plus

- **WHEN** phone input is `84912345678`
- **THEN** the normalizer MUST return `+84912345678`

#### Scenario: Non-Vietnam number

- **WHEN** phone input is a US-style number such as `(781) 555-0199`
- **THEN** the normalizer MUST return null

### Requirement: Booking confirmation SMS content

The system SHALL send a plain-text booking confirmation SMS that includes booking `reference`, scheduled `date`, scheduled `time`, and customer first name.

For Vietnam recipients in v1, the message body MUST be written in Vietnamese.

#### Scenario: Confirmation SMS body

- **WHEN** a confirmation SMS is sent for booking reference `AV-20260904-001`
- **THEN** the message MUST include that reference, date, and time
- **AND** MUST be plain text suitable for SMS delivery

### Requirement: Twilio setup documentation

The repository MUST include `docs/twilio-sms-setup.md` documenting: creating a Twilio trial account, verifying a test recipient number, required env vars (`TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_SMS_FROM`, optional `SMS_ENABLED`), Vietnam E.164 testing steps, and trial limitations (verified recipients only).

#### Scenario: Operator onboarding

- **WHEN** a developer reads `docs/twilio-sms-setup.md`
- **THEN** the document MUST list every env var required for production SMS
- **AND** MUST explain how to test with a Vietnam mobile on a trial account
