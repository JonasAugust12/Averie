## Design Summary

Add Twilio Programmable SMS to send a **booking confirmation text** immediately after a successful public or admin booking create. Phone is already required on the booking form; email is optional. v1 targets **Vietnam mobile numbers only** (`+84` E.164) so the operator can test with a Twilio trial account and a verified VN handset. The implementation mirrors the existing Resend email pattern: server-only helper, graceful skip when env is missing, fire-and-forget after persist, timestamp on the booking document.

## Alternatives Considered

### Alternative A: Mirror email architecture (Twilio server helper + hook in createBookingAction)

- **Approach**: `src/server/sms.server.ts`, VN E.164 normalizer, call from `createBookingAction` after `Booking.create`, persist `smsNotifications.confirmationSentAt`.
- **Pros**: Consistent with Resend; minimal surface area; booking still succeeds if SMS fails; easy to extend later (reminder cron, admin resend).
- **Cons**: Two notification channels to maintain; need VN-specific phone parsing separate from US-centric lookup utils.
- **Why not chosen**: N/A — **chosen**.

### Alternative B: Twilio logic inline in createBookingAction

- **Approach**: Import Twilio SDK directly in the action without a dedicated server module.
- **Pros**: Fastest initial diff.
- **Cons**: Harder to test and reuse; violates separation used by email; duplicates env guard logic.
- **Why not chosen**: Does not match project conventions established by `email.server.ts`.

### Alternative C: SMS reminder cron in v1 (parity with email)

- **Approach**: Add `/api/cron/booking-sms-reminders` alongside email reminders in the first release.
- **Pros**: Feature parity with email reminders.
- **Cons**: Scope creep; Twilio trial + VN-only v1 does not need reminders yet; doubles cron and spec work.
- **Why not chosen**: Deferred to a follow-up change after confirmation SMS is proven.

## Agreed Approach

**Alternative A** — Twilio confirmation SMS on create, VN-only v1, mirror email patterns. Send automatically when the normalized phone is a valid Vietnam mobile number (no separate opt-in checkbox in v1 — phone is already required for booking). Non-VN numbers are skipped silently with a server log (US salon production numbers unaffected until a later change expands allowlist).

## Key Decisions

1. **Provider**: Twilio Programmable SMS (trial-friendly for dev).
2. **Trigger**: `createBookingAction` after successful persist (same as confirmation email).
3. **Scope v1**: Confirmation SMS only; no reminder cron, no admin resend modal.
4. **Geography**: Vietnam `+84` only — normalize `09xx`, `84xx`, `+84xx` to E.164.
5. **Failure mode**: SMS failure must not fail booking create (status 201 unchanged).
6. **Missing credentials**: Skip send with console warning (same as missing `RESEND_API_KEY`).
7. **Message language**: Vietnamese body for VN numbers in v1 (operator testing); English expansion later.
8. **Persistence**: Add `smsNotifications.confirmationSentAt` on Booking (parallel to email fields).
9. **UI**: Optional helper text on customer step that confirmation SMS is sent to the phone number (i18n vi/en); confirmation page may show sent indicator when timestamp returned in DTO.

## Open Questions

- **Production US numbers**: v1 skips non-`+84` — acceptable until a follow-up adds US E.164 support.
- **Twilio trial restriction**: Trial accounts only deliver to verified numbers — document in setup guide; not a code change.
