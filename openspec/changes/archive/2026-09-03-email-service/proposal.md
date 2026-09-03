## Why

Customers who book at Averie receive no automated confirmation or reminder today. Staff must rely on phone follow-up, which increases no-shows and support load. Operators also need a way to resend appointment details when a guest did not provide an email at booking time. Adding Resend-powered transactional email (confirmation on create, reminder before the appointment, admin manual send) improves customer confidence and reduces missed appointments without requiring email as a mandatory booking field.

## What Changes

**Transactional email infrastructure**

- From: No email integration.
- To: Resend SDK + React Email templates (`noreply@averienails.com`), shared send helpers, env-based configuration.
- Reason: Verified domain on Resend; lower cost than prior SendGrid setup.
- Impact: New server-only dependency and env vars; non-breaking when API key absent (graceful skip in dev).

**Booking confirmation on create**

- From: `createBookingAction` persists booking only.
- To: After successful create, send confirmation email when `customer.email` is present; skip when absent.
- Reason: Optional email with soft UI encouragement (user decision).
- Impact: Non-breaking; bookings without email behave as today.

**Appointment reminder cron**

- From: No scheduled jobs.
- To: Vercel Cron every 2 hours calls reminder Route Handler; sends to upcoming bookings ~1 hour before start (windowed query).
- Reason: User deploys on Vercel single instance; built-in cron is sufficient.
- Impact: Requires `vercel.json` cron + `CRON_SECRET`; Pro plan cron feature.

**Booking email tracking**

- From: Booking documents have no send metadata.
- To: `emailNotifications.confirmationSentAt` and `reminderSentAt` on Booking.
- Reason: Idempotent reminders and admin visibility.
- Impact: Non-breaking schema extension; existing bookings default unset.

**Admin manual send**

- From: Admin booking detail has no email action.
- To: Send-email modal on booking detail with editable recipient; admin-only Server Action.
- Reason: Operators can reach guests who skipped email on the form.
- Impact: Admin-only; non-breaking.

**Booking form UX**

- From: Email field optional without guidance.
- To: Optional email with i18n helper text encouraging entry for automatic confirmations.
- Impact: Non-breaking UX copy addition.

## Capabilities

### New Capabilities

- `salon-transactional-email`: Resend integration, React Email templates, confirmation/reminder send helpers, Vercel Cron reminder route, setup documentation.

### Modified Capabilities

- `appointment-booking`: Create booking mutation sends confirmation when email present; customer form shows optional-email guidance.
- `salon-admin`: Bookings management UI adds admin send-email action on booking detail.
- `salon-persistence`: Booking model persists email notification timestamps.

## Impact

- **New**: `src/server/email.server.ts`, `src/emails/**`, `src/app/api/cron/booking-reminders/route.ts`, `vercel.json`, `docs/email-resend-setup.md`
- **Modified**: `src/actions/booking.action.ts`, new `src/actions/booking-email.action.ts`, `src/models/booking.model.ts`, `src/mappers/booking.mapper.ts`, booking customer step UI, `src/app/admin/bookings/[id]/page.tsx`
- **Env**: `RESEND_API_KEY`, `EMAIL_FROM`, `CRON_SECRET`
- **Deps**: `resend`, `@react-email/components`, `@react-email/render`
- **i18n**: `messages/en|vi/booking.json`, `messages/en|vi/admin.json`

## Non-Goals

- Mandatory email on booking
- Cancel/reschedule notification emails
- Marketing broadcasts / Resend Audiences
- SMS reminders
- Email open/click analytics dashboard
- Bizfly/server-side cron (Vercel Cron only)
