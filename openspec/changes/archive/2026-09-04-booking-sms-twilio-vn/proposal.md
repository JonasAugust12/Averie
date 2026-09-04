## Why

Customers who book without entering an email receive no automated confirmation today, even though phone is already required on the booking form. Email-only notifications leave a gap for guests who skip email — common in Vietnam testing and for phone-first users. Adding Twilio SMS confirmation on booking create improves reach for VN test numbers immediately and establishes the same non-blocking notification pattern as Resend email without making SMS mandatory for booking success.

## What Changes

**Twilio SMS infrastructure**

- From: No SMS integration.
- To: Twilio SDK + server send helper, env-based configuration, setup documentation.
- Reason: Operator trial account for VN testing; mirrors proven email architecture.
- Impact: New server-only dependency and env vars; non-breaking when credentials absent (graceful skip).

**Booking confirmation SMS on create (Vietnam v1)**

- From: `createBookingAction` sends email only when `customer.email` is present.
- To: After successful create, when `customer.phone` normalizes to Vietnam E.164 (`+84`), send confirmation SMS; skip non-VN numbers without error.
- Reason: Phone already collected; VN-only scope keeps trial testing simple.
- Impact: Non-breaking; US/other formats behave as today (no SMS).

**SMS send tracking**

- From: Booking documents have no SMS metadata.
- To: Optional `smsNotifications.confirmationSentAt` on Booking and DTO when send succeeds.
- Reason: Idempotency visibility and parity with email timestamps.
- Impact: Non-breaking schema extension.

**Customer form UX copy**

- From: Helper text mentions email for confirmations only.
- To: Localized copy also mentions SMS confirmation to the phone number (VN-focused wording acceptable in both locales).
- Impact: Non-breaking UX copy addition.

## Capabilities

### New Capabilities

- `salon-transactional-sms`: Twilio integration, VN E.164 normalization, confirmation SMS helper, setup documentation.

### Modified Capabilities

- `appointment-booking`: `createBookingAction` triggers VN confirmation SMS; customer step helper text mentions SMS.
- `salon-persistence`: Booking model persists `smsNotifications.confirmationSentAt`.

## Impact

- **Code**: `src/server/sms.server.ts`, `src/utils/phone-vn.util.ts`, `src/actions/booking.action.ts`, `src/models/booking.model.ts`, mappers/DTOs, i18n messages, `.env.example`.
- **Dependencies**: `twilio` npm package.
- **Env**: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_SMS_FROM`, optional `SMS_ENABLED`.
- **Docs**: `docs/twilio-sms-setup.md` (new).
- **Non-goals**: SMS reminders, admin resend SMS, US/international SMS, marketing SMS.

## Non-goals

- SMS appointment reminders or cron routes.
- Admin manual send-SMS modal.
- US E.164 or global SMS allowlist (follow-up change).
- Replacing email confirmation.
- Opt-in checkbox separate from required phone field.
