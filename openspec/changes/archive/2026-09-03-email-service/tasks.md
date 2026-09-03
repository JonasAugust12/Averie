## 1. Dependencies and environment [db]

- [x] 1.1 [db] Add `resend`, `@react-email/components`, and `@react-email/render` to `package.json` via `pnpm add resend @react-email/components @react-email/render`
- [x] 1.2 [db] Document `RESEND_API_KEY`, `EMAIL_FROM`, and `CRON_SECRET` in `.env.example`

## 2. Persistence and DTO layer [db]

- [x] 2.1 [db] Add `emailNotifications.confirmationSentAt` and `emailNotifications.reminderSentAt` to `Booking` schema in `src/models/booking.model.ts`
- [x] 2.2 [db] Extend `BookingDto` with optional `emailNotifications` ISO fields in `src/types/booking.type.ts`
- [x] 2.3 [db] Map `emailNotifications` in `serializeBooking` (`src/mappers/booking.mapper.ts`)

## 3. Email templates and server helpers [action]

- [x] 3.1 [action] Create `src/emails/components/EmailLayout.tsx` with Averie brand colors and salon contact footer
- [x] 3.2 [action] Create `src/emails/BookingConfirmationEmail.tsx` and `src/emails/BookingReminderEmail.tsx`
- [x] 3.3 [action] Create `src/server/email.server.ts` with `sendBookingConfirmation`, `sendBookingReminder`, and `sendBookingEmailToRecipient`; skip gracefully when `RESEND_API_KEY` is missing

## 4. Booking create confirmation trigger [action]

- [x] 4.1 [action] After successful `Booking.create` in `createBookingAction`, send confirmation when `customer.email` is present and set `confirmationSentAt` on success
- [x] 4.2 [action] Ensure booking create still returns 201 when email send fails (log only)

## 5. Reminder cron route [api]

- [x] 5.1 [api] Create `GET /api/cron/booking-reminders` Route Handler with `CRON_SECRET` auth
- [x] 5.2 [api] Query upcoming bookings in salon-local 45–135 minute window with unset `reminderSentAt` and present `customer.email`
- [x] 5.3 [api] Send reminder per match and persist `reminderSentAt`; return `{ sent, skipped }` envelope
- [x] 5.4 [api] Add `vercel.json` cron schedule `0 */2 * * *` pointing to `/api/cron/booking-reminders`

## 6. Admin manual send [action] [ui]

- [x] 6.1 [action] Create `sendBookingEmailAction` in `src/actions/booking-email.action.ts` (admin-only, Zod input: `bookingId`, `to`, `template`)
- [x] 6.2 [ui] Add send-email modal and button on `src/app/admin/bookings/[id]/page.tsx` with template picker and recipient prefill
- [x] 6.3 [ui] Wire mutation via `@services/booking.service.ts` or dedicated service hook

## 7. Booking wizard optional-email UX [ui]

- [x] 7.1 [ui] Add helper text under email field in `CustomerStep.tsx` encouraging entry for automatic confirmation/reminder
- [x] 7.2 [ui] Add i18n keys to `messages/en/booking.json` and `messages/vi/booking.json` (`customer.emailHelper`)
- [x] 7.3 [ui] Add admin i18n keys for send-email modal in `messages/en/admin.json` and `messages/vi/admin.json`

## 8. Documentation and verification [api] [ui]

- [x] 8.1 [api] Create `docs/email-resend-setup.md` (API key, domain, env vars, Vercel cron, smoke test)
- [x] 8.2 [ui] Run `pnpm type-check` and `pnpm lint`
- [x] 8.3 [ui] Manual QA: booking with email → confirmation; without email → no send; admin manual send; cron route with valid secret
