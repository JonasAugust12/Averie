## Context

Averie already sends optional **confirmation email** via Resend from `createBookingAction` when `customer.email` is present (`src/server/email.server.ts`, `emailNotifications` on Booking). Phone is **required** on every booking (`bookingCustomerCreateSchema`, Mongoose `customer.phone`). Existing `phone.util.ts` optimizes US lookup variants, not outbound SMS formatting. Operator wants Twilio trial SMS to a VN handset for easy testing while production salon remains US-oriented on Vercel.

## Goals / Non-Goals

**Goals:**

- Send one transactional confirmation SMS after successful booking create for valid VN mobile numbers.
- Mirror email: server helper, env-gated, non-blocking errors, timestamp on booking.
- E.164 normalization for Vietnam (`+849xxxxxxxx`).
- Setup doc for Twilio trial (verify recipient, env vars).
- Extend Booking DTO with optional `smsNotifications.confirmationSentAt` when send succeeds.

**Non-Goals:**

- SMS appointment reminders / cron jobs.
- Admin manual “resend SMS” action.
- US or international SMS beyond VN in v1.
- Marketing SMS or opt-in marketing lists.
- Replacing or removing email confirmation.
- Storing raw Twilio message SIDs (optional nice-to-have, not v1).

## Decisions

### 1. Server module: `src/server/sms.server.ts`

**Decision**: Dedicated module like `email.server.ts` with `getTwilioClient()`, `sendBookingConfirmationSms(toE164, context)`.

**Rationale**: Keeps `createBookingAction` thin; centralizes env guards and Twilio SDK usage.

**Alternative rejected**: Inline in action (Alternative B from brainstorm).

### 2. VN normalization: `src/utils/phone-vn.util.ts`

**Decision**: New util with `toVietnamE164(raw: string): string | null`.

Rules:

- Strip non-digits except leading `+`.
- Accept `0xxxxxxxxx` (10 digits) → `+84` + 9 digits.
- Accept `84xxxxxxxxx` (11 digits) → `+84xxxxxxxxx`.
- Accept `+84xxxxxxxxx` already.
- Reject if not 9 digits after country code or invalid VN mobile prefix.

**Rationale**: Do not extend US-centric `phone.util.ts` for outbound SMS — lookup and send have different rules.

### 3. Hook point: `createBookingAction`

**Decision**: After `Booking.create` and optional email block, attempt SMS when `toVietnamE164(customer.phone)` succeeds.

**Rationale**: Single mutation path for public and admin-created bookings.

### 4. Auto-send without opt-in checkbox

**Decision**: Send when phone normalizes to VN E.164; no new form field in v1.

**Rationale**: Phone already required; operator testing path is simpler; helper text discloses SMS will be sent.

### 5. Dependencies

**Decision**: Add `twilio` npm package (official SDK).

**Rationale**: Standard, well-documented; trial account supported.

**Env vars** (server-only):

| Variable             | Required | Description                                                      |
| -------------------- | -------- | ---------------------------------------------------------------- |
| `TWILIO_ACCOUNT_SID` | prod     | Account SID                                                      |
| `TWILIO_AUTH_TOKEN`  | prod     | Auth token                                                       |
| `TWILIO_SMS_FROM`    | prod     | Twilio sender (E.164)                                            |
| `SMS_ENABLED`        | no       | When `false`, skip all SMS (default: enabled when creds present) |

### 6. SMS body

**Decision**: Plain-text template function `buildBookingConfirmationSmsBody(context)` — Vietnamese for v1, includes reference, date, time, salon name/phone one-liner; keep under ~320 chars.

**Rationale**: SMS is not HTML; React Email patterns do not apply.

### 7. Context builder

**Decision**: Reuse `buildBookingEmailContext` or a thin wrapper `buildBookingSmsContext` sharing the same enriched fields (reference, date, time, services, customer first name).

## Risks / Trade-offs

| Risk                                        | Mitigation                                                                |
| ------------------------------------------- | ------------------------------------------------------------------------- |
| Twilio trial only sends to verified numbers | Document in `docs/twilio-sms-setup.md`; operator verifies VN test handset |
| US production customers get no SMS in v1    | Explicit skip + log for non-VN; no error shown to user                    |
| Duplicate SMS on retry/reference collision  | Only one create succeeds; no resend on same create path                   |
| Twilio cost / rate limits                   | v1 low volume; log failures; skip when env missing                        |
| VN regulatory sender requirements later     | v1 trial/dev; production upgrade documented as follow-up                  |

## Migration Plan

1. Deploy code with env vars unset → behavior unchanged (skip SMS).
2. Add Twilio env on Vercel preview/staging → test with verified VN number.
3. No Mongo migration required — new optional subdocument field; existing bookings valid without it.
4. Rollback: remove env vars or set `SMS_ENABLED=false`.

## Open Questions

- Whether to expose `smsNotifications` on public confirmation API (`GET /api/bookings/by-reference`) — recommend **admin + create response only** in v1; public lookup unchanged unless product wants “SMS sent” badge on confirmation page from create DTO only.
