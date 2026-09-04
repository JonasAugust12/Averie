# Twilio SMS setup (booking confirmation)

Averie sends a **Vietnam-only** confirmation SMS after a successful online booking when Twilio credentials are configured. Booking creation always succeeds even if SMS is skipped or fails.

## 1. Create a Twilio account

1. Sign up at [https://www.twilio.com/try-twilio](https://www.twilio.com/try-twilio).
2. From the [Twilio Console](https://console.twilio.com/), note your **Account SID** and **Auth Token**.
3. Buy or use a trial **phone number** with SMS capability — this becomes `TWILIO_SMS_FROM` (E.164, e.g. `+15551234567`).

### Trial limitations

- Trial accounts can only send SMS to **verified recipient numbers**.
- In Console → **Phone Numbers → Verified Caller IDs**, add each Vietnam test number (e.g. your `+84` mobile) before smoke testing.

## 2. Environment variables

Add to `.env.local` (local) or Vercel **Project → Environment Variables** (production):

| Variable             | Required      | Description                             |
| -------------------- | ------------- | --------------------------------------- |
| `TWILIO_ACCOUNT_SID` | Yes (to send) | Account SID from Twilio Console         |
| `TWILIO_AUTH_TOKEN`  | Yes (to send) | Auth token from Twilio Console          |
| `TWILIO_SMS_FROM`    | Yes (to send) | Twilio sender number (E.164)            |
| `SMS_ENABLED`        | No            | Set to `false` to disable all SMS sends |

When any Twilio variable is missing, the app logs a warning and skips SMS — the booking still returns `201`.

See also `.env.example`.

## 3. Vietnam phone normalization

Only numbers that normalize to `+84` with a valid VN mobile prefix (`3`, `5`, `7`, `8`, or `9`) receive SMS.

| Input example    | Normalized     | SMS                         |
| ---------------- | -------------- | --------------------------- |
| `0912345678`     | `+84912345678` | Sent (if Twilio configured) |
| `84912345678`    | `+84912345678` | Sent                        |
| `+84912345678`   | `+84912345678` | Sent                        |
| `(781) 923-1955` | —              | Skipped (US / non-VN)       |
| `0212345678`     | —              | Skipped (landline prefix)   |

Implementation: `src/utils/phone-vn.util.ts` (`toVietnamE164`).

## 4. Smoke test (local)

1. Copy env vars into `.env.local` and restart `pnpm dev`.
2. Verify your `+84` test number in Twilio Console (trial).
3. Complete a booking with phone `091x xxx xxx` (or `+84…`).
4. Confirm:
    - HTTP `201` and booking reference in the UI.
    - SMS received on the verified phone.
    - `smsNotifications.confirmationSentAt` present on the booking DTO / confirmation page hint.
5. Repeat with a US phone — booking succeeds, no SMS, server log: `SMS skipped — phone is not a valid Vietnam mobile number`.
6. Unset Twilio env vars — booking succeeds, log: `Twilio env missing — skipping send`.

## 5. Production notes

- Set the same variables on Vercel for Production (and Preview if needed).
- SMS body is plain Vietnamese text (GSM-7 friendly) built in `src/server/sms.server.ts`.
- Rollback: remove Twilio env vars or set `SMS_ENABLED=false`.
