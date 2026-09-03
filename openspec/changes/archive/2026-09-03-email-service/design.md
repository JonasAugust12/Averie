## Context

Averie is a Next.js 15 App Router app on **Vercel** with MongoDB bookings. Customers optionally provide `customer.email` at booking time. There is no email layer today. BRIX-Server used SendGrid + MJML; this change adopts **Resend** (domain `averienails.com` verified) for lower cost. Reference: [Resend Next.js docs](https://resend.com/docs/send-with-nextjs).

## Goals / Non-Goals

**Goals:**

- Send branded **confirmation** email after booking create when email present
- Send **reminder** email ~1 hour before appointment via Vercel Cron (2h interval)
- **Admin manual send** from booking detail with editable recipient email
- **Setup docs** for Resend API key, env vars, Vercel cron
- Track send timestamps on booking to prevent duplicate reminders

**Non-Goals:**

- Require email on booking form
- Marketing campaigns / Resend Audiences
- SMS notifications
- Customer email preferences/unsubscribe portal (v1)
- Cancel/reschedule notification emails (follow-up change)

## Decisions

### 1. Email stack

- **Package**: `resend` + `@react-email/components` + `@react-email/render`
- **Layout**: `src/emails/components/EmailLayout.tsx` — header logo, cream background, primary text `#2B2623`, accent `#D4C5B9`
- **Templates**: `BookingConfirmationEmail.tsx`, `BookingReminderEmail.tsx` (shared booking summary block)
- **Server**: `src/server/email.server.ts` — `sendBookingConfirmation()`, `sendBookingReminder()`, `sendBookingEmailToRecipient()`; reads `RESEND_API_KEY`, `EMAIL_FROM` (default `Averie <noreply@averienails.com>`)

### 2. Trigger points

| Event           | Trigger                                         | Type                                       |
| --------------- | ----------------------------------------------- | ------------------------------------------ |
| Booking created | `createBookingAction` after `Booking.create`    | Server-side async send if `customer.email` |
| Reminder        | Vercel Cron → `GET /api/cron/booking-reminders` | Route Handler                              |
| Admin manual    | `sendBookingEmailAction`                        | Server Action (admin)                      |

Mutations stay in Server Actions per Averie rules; cron stays Route Handler (external scheduler).

### 3. Vercel Cron

Add `vercel.json`:

```json
{
    "crons": [
        {
            "path": "/api/cron/booking-reminders",
            "schedule": "0 */2 * * *"
        }
    ]
}
```

Route validates `Authorization: Bearer ${CRON_SECRET}` (Vercel Cron header). Returns `{ status, message, data: { sent, skipped } }`.

**Reminder window** (salon-local, `SALON_TIMEZONE`):

- Select bookings: `status: 'upcoming'`, `reminderSentAt` unset
- Appointment start in **[now + 45min, now + 135min]** — ensures 2h cron catches ~1h-before target

### 4. Persistence

Extend `Booking` schema:

```typescript
emailNotifications: {
  confirmationSentAt?: Date;
  reminderSentAt?: Date;
}
```

Mapper exposes ISO strings on DTO (admin read-only). Set `confirmationSentAt` after successful Resend response on create; set `reminderSentAt` per booking in cron batch.

### 5. Failure handling

- Missing `RESEND_API_KEY`: log warning, skip send (dev-friendly, like BRIX graceful degradation)
- Resend API error on confirmation: **do not roll back booking**; log error; leave `confirmationSentAt` unset (admin can resend)
- Cron: per-booking try/catch; continue batch

### 6. Admin UI

On `src/app/admin/bookings/[id]/page.tsx`:

- **Send email** button (Mail icon) opens modal
- Fields: recipient email (prefill `booking.customer.email`), read-only booking summary
- Submit → `sendBookingEmailAction({ bookingId, to, template: 'confirmation' | 'reminder' })`
- Success toast; styled with existing admin patterns (stone/cream/nude)

List page optional quick action deferred (detail-only v1).

### 7. Booking wizard UX

- Keep email **optional** in Zod schema
- Add helper text under email field (en/vi): encourage entering email to receive confirmation and reminder
- No blocking validation when empty

### 8. Documentation

- `docs/email-resend-setup.md` — API key creation, env vars, domain verification checklist, Vercel cron + `CRON_SECRET`, local testing with Resend test mode

## Risks / Trade-offs

| Risk                                  | Mitigation                                                                                                    |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| 2h cron misses exact 1h reminder      | 45–135min window; acceptable for salon use                                                                    |
| Duplicate reminders on cron overlap   | `reminderSentAt` + atomic update                                                                              |
| Email send slows booking action       | Send after persist; don't await in critical path if latency issue (still await in v1 for simpler idempotency) |
| Vercel Cron only on Pro               | Document requirement; user on Vercel                                                                          |
| Guest without email gets no auto mail | Admin manual send; UI hint                                                                                    |

## Migration Plan

1. Add env vars to Vercel project + `.env.example`
2. Deploy code + `vercel.json` cron
3. Set `CRON_SECRET` in Vercel (auto-injected for cron routes)
4. Smoke test: create booking with email → confirmation; wait/trigger cron → reminder
5. Rollback: remove cron from `vercel.json`; emails stop; bookings unaffected

## Open Questions

None for v1.
