# salon-transactional-email Specification

## Purpose

Transactional email for salon bookings via Resend: branded templates, confirmation and reminder sends, Vercel Cron scheduling, and operator setup documentation.

## Requirements

### Requirement: Resend email provider configuration

The system SHALL send transactional booking emails through the Resend API using a verified sending domain for `averienails.com`.

The default from address MUST be `Averie <noreply@averienails.com>` unless overridden by server env `EMAIL_FROM`.

When `RESEND_API_KEY` is missing or empty, send helpers MUST log a warning and MUST NOT throw during booking create; booking persistence MUST remain unaffected.

#### Scenario: Send with valid API key

- **WHEN** `RESEND_API_KEY` is configured and a send helper is invoked with valid parameters
- **THEN** the system MUST call Resend to deliver HTML email to the recipient
- **AND** MUST use the configured from address

#### Scenario: Missing API key in development

- **WHEN** `RESEND_API_KEY` is not set and a send helper is invoked
- **THEN** the helper MUST skip the external API call
- **AND** MUST log that email is disabled

### Requirement: Branded booking email templates

The system SHALL provide React Email templates for booking confirmation and booking reminder that use Averie theme colors (primary `#2B2623`, secondary `#D4C5B9`, tertiary/cream `#F5EFEA` / `#FDFCFB`) and include booking reference, services, date, time, salon address, and phone.

#### Scenario: Confirmation template content

- **WHEN** a confirmation email is rendered for a booking
- **THEN** the HTML MUST include the booking `reference`, scheduled `date` and `time`, service names, and salon contact details
- **AND** MUST include a clear subject line identifying Averie and the appointment

#### Scenario: Reminder template content

- **WHEN** a reminder email is rendered for a booking
- **THEN** the HTML MUST indicate the appointment is upcoming (approximately one hour before)
- **AND** MUST include the same core booking details as the confirmation template

### Requirement: Booking reminder cron route

The system SHALL expose `GET /api/cron/booking-reminders` as a Route Handler invoked by Vercel Cron on a schedule of every two hours.

The handler MUST authenticate requests using the Vercel Cron secret (`CRON_SECRET` / `Authorization: Bearer` pattern).

The handler MUST query `upcoming` bookings whose salon-local appointment start falls within a window from 45 to 135 minutes ahead of the current salon-local time, where `emailNotifications.reminderSentAt` is unset, and `customer.email` is present.

For each matching booking, the handler MUST send a reminder email and MUST set `emailNotifications.reminderSentAt` on success.

#### Scenario: Cron sends reminder

- **WHEN** the cron route runs and a matching upcoming booking has `customer.email`
- **THEN** the handler MUST send a reminder email
- **AND** MUST persist `reminderSentAt` on that booking

#### Scenario: Cron skips without email

- **WHEN** a matching booking has no `customer.email`
- **THEN** the handler MUST NOT attempt to send
- **AND** MUST NOT set `reminderSentAt`

#### Scenario: Unauthorized cron request

- **WHEN** the cron route is called without valid cron authorization
- **THEN** the handler MUST return status `401`
- **AND** MUST NOT send emails

### Requirement: Resend setup documentation

The repository MUST include `docs/email-resend-setup.md` documenting: creating a Resend API key, required env vars (`RESEND_API_KEY`, `EMAIL_FROM`, `CRON_SECRET`), domain verification for `averienails.com`, Vercel Cron configuration in `vercel.json`, and smoke-test steps after deploy.

#### Scenario: Operator onboarding

- **WHEN** a developer reads `docs/email-resend-setup.md`
- **THEN** the document MUST list every env var required for production email
- **AND** MUST describe how to verify cron and send a test booking confirmation
