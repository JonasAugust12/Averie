# Apply receipt — booking-sms-twilio-vn

**Date:** 2026-09-04  
**Schema:** superspec  
**Progress:** 13/14 tasks (7.2 manual smoke pending operator)

## Summary

Implemented Twilio confirmation SMS for Vietnam mobile numbers after successful booking create, mirroring the existing Resend email flow.

## Files changed

| Area        | Files                                                                                                                         |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Dependency  | `package.json`, `pnpm-lock.yaml` — `twilio@^6.1.0`                                                                            |
| Env / docs  | `.env.example`, `docs/twilio-sms-setup.md`                                                                                    |
| Phone util  | `src/utils/phone-vn.util.ts`                                                                                                  |
| SMS server  | `src/server/sms.server.ts`                                                                                                    |
| Persistence | `src/models/booking.model.ts`                                                                                                 |
| DTO / API   | `src/types/booking.type.ts`, `src/mappers/booking.mapper.ts`, `src/openapi/schemas/booking.schema.ts`                         |
| Action      | `src/actions/booking.action.ts`                                                                                               |
| UI / i18n   | `src/components/booking/CustomerStep.tsx`, `ConfirmationPageView.tsx`, `messages/en/booking.json`, `messages/vi/booking.json` |

## Behavior

- After `Booking.create`, if phone normalizes to `+84` via `toVietnamE164`, sends Vietnamese confirmation SMS via Twilio.
- On success, sets `smsNotifications.confirmationSentAt` on booking and DTO.
- Skips gracefully when: `SMS_ENABLED=false`, Twilio env missing, non-VN phone, or Twilio error — booking always returns `201`.
- Non-VN phones log `console.warn` with skip reason.

## Verification

- [x] `pnpm type-check` — pass
- [x] `pnpm lint` — pass
- [ ] Manual Twilio smoke (task 7.2) — requires trial account + verified +84 recipient

## Next steps

1. Set Twilio env vars locally or on Vercel.
2. Run manual smoke per `docs/twilio-sms-setup.md`.
3. `/opsx-verify booking-sms-twilio-vn`
4. `/opsx-archive booking-sms-twilio-vn` when verified
