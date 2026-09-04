# Booking SMS (Twilio VN) Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Send a Vietnamese confirmation SMS via Twilio after successful booking create when phone normalizes to `+84` E.164.

**Architecture:** Mirror `email.server.ts` — `phone-vn.util.ts` normalizes input, `sms.server.ts` wraps Twilio, `createBookingAction` fires non-blocking send and persists `smsNotifications.confirmationSentAt`. Graceful skip when env missing or non-VN phone.

**Tech Stack:** Next.js 15 Server Actions, Twilio Node SDK, Mongoose 8, Zod, next-intl

**Refs:** `proposal.md`, `design.md`, `specs/*`, `tasks.md`, `src/server/email.server.ts`, `src/actions/booking.action.ts`

---

## Task 1: Dependencies and env

**Files:** `package.json`, `.env.example`, `docs/twilio-sms-setup.md`

- [ ] **Step 1:** Run `pnpm add twilio`
- [ ] **Step 2:** Append Twilio env block to `.env.example` with comments
- [ ] **Step 3:** Write `docs/twilio-sms-setup.md` (trial, verify +84 recipient, env table, smoke steps)
- [ ] **Step 4:** Run `pnpm type-check`
- [ ] **Step 5:** Commit `chore: add twilio dependency and sms setup doc`

---

## Task 2: Vietnam E.164 util

**Files:** `src/utils/phone-vn.util.ts`

- [ ] **Step 1:** Implement `extractDigits`, `toVietnamE164(raw: string): string | null`
- [ ] **Step 2:** Handle `0xxxxxxxxx`, `84xxxxxxxxx`, `+84xxxxxxxxx`; reject US 10-digit
- [ ] **Step 3:** Run `pnpm type-check`
- [ ] **Step 4:** Commit `feat: add Vietnam E.164 phone normalizer`

---

## Task 3: SMS server module

**Files:** `src/server/sms.server.ts`

- [ ] **Step 1:** Add `getTwilioClient()` — return null if creds missing or `SMS_ENABLED=false`
- [ ] **Step 2:** Add `buildBookingConfirmationSmsBody(context)` — Vietnamese plain text, ≤320 chars
- [ ] **Step 3:** Add `sendBookingConfirmationSms(toE164, context): Promise<boolean>` using Twilio messages.create
- [ ] **Step 4:** Log Twilio errors; return false on failure (no throw)
- [ ] **Step 5:** Run `pnpm type-check`
- [ ] **Step 6:** Commit `feat: add Twilio booking confirmation SMS server helper`

---

## Task 4: Booking model and mapper

**Files:** `src/models/booking.model.ts`, `src/mappers/booking.mapper.ts`, `src/types/booking.type.ts` (or `@typings`)

- [ ] **Step 1:** Add `smsNotifications: { confirmationSentAt: Date }` sub-schema on Booking
- [ ] **Step 2:** Extend DTO type with optional `smsNotifications.confirmationSentAt` ISO string
- [ ] **Step 3:** Map field in `serializeBooking`
- [ ] **Step 4:** Run `pnpm type-check`
- [ ] **Step 5:** Commit `feat: persist sms notification timestamp on booking`

---

## Task 5: createBookingAction hook

**Files:** `src/actions/booking.action.ts`

- [ ] **Step 1:** Import `toVietnamE164`, `sendBookingConfirmationSms`, `buildBookingEmailContext`
- [ ] **Step 2:** After email block, normalize phone; if E.164, build context and send SMS in try/catch
- [ ] **Step 3:** On success, `Booking.findByIdAndUpdate` with `smsNotifications.confirmationSentAt`; merge into returned dto
- [ ] **Step 4:** Ensure SMS errors only `console.error` — never change 201 response
- [ ] **Step 5:** Run `pnpm type-check` and `pnpm lint`
- [ ] **Step 6:** Commit `feat: send VN confirmation SMS on booking create`

---

## Task 6: Customer step i18n

**Files:** `messages/en/booking.json`, `messages/vi/booking.json`, `src/components/booking/CustomerStep.tsx`

- [ ] **Step 1:** Add `customer.phoneSmsHint` keys (vi/en)
- [ ] **Step 2:** Render hint below phone field (mirror email helper pattern)
- [ ] **Step 3:** Run `pnpm type-check`
- [ ] **Step 4:** Commit `feat: add SMS confirmation hint on booking customer step`

---

## Task 7: Manual verification

- [ ] **Step 1:** Set Twilio env in `.env.local`; verify trial recipient +84 number
- [ ] **Step 2:** Create booking with `0912345678` — expect SMS + timestamp in response
- [ ] **Step 3:** Create booking with US phone — expect 201, no SMS, no error
- [ ] **Step 4:** Unset Twilio env — expect 201, skip SMS, booking OK
- [ ] **Step 5:** Run `pnpm type-check`, `pnpm lint`, `pnpm build`

---

## Global constraints

- Mutations stay in Server Actions; no SMS Route Handler for create path
- Missing Twilio config MUST NOT break booking create
- v1 VN only — do not send to non-`+84` numbers
