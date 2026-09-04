## 1. Dependencies and environment

- [x] 1.1 [action] Add `twilio` to `package.json`; document env vars in `.env.example` (`TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_SMS_FROM`, `SMS_ENABLED`)
- [x] 1.2 [action] Create `docs/twilio-sms-setup.md` (trial account, verify VN recipient, env vars, smoke test)

## 2. Phone normalization (Vietnam)

- [x] 2.1 [action] Implement `src/utils/phone-vn.util.ts` with `toVietnamE164(raw): string | null`
- [x] 2.2 [action] Add unit-style tests or manual test cases documented in setup guide for `09xx`, `84xx`, `+84xx`, US skip

## 3. SMS server layer

- [x] 3.1 [action] Create `src/server/sms.server.ts` — Twilio client guard, `sendBookingConfirmationSms`, Vietnamese body builder
- [x] 3.2 [action] Reuse or wrap `buildBookingEmailContext` for SMS context (reference, date, time, services, firstName)

## 4. Persistence and DTOs

- [x] 4.1 [db] Add `smsNotifications.confirmationSentAt` to Booking Mongoose schema
- [x] 4.2 [action] Update `serializeBooking` / `BookingDto` to expose optional `smsNotifications.confirmationSentAt`

## 5. Booking create integration

- [x] 5.1 [action] Hook SMS send in `createBookingAction` after persist (parallel to email block); update timestamp on success; never fail 201 on SMS error
- [x] 5.2 [action] Log skip reason for non-VN phones (debug level / console.warn)

## 6. UI copy (optional light touch)

- [x] 6.1 [ui] Add i18n helper text on customer step (vi/en) mentioning confirmation SMS to phone for VN numbers
- [x] 6.2 [ui] Optionally show SMS sent hint on confirmation view when DTO includes `smsNotifications.confirmationSentAt`

## 7. Verification

- [x] 7.1 [action] Run `pnpm type-check` and `pnpm lint`
- [ ] 7.2 [action] Manual smoke: booking with `091x` on Twilio trial verified number; booking with US phone skips SMS; missing env skips SMS
