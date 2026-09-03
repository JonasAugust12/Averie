## Design Summary

Integrate **Resend** transactional email into Averie (Vercel deployment) so customers receive a **booking confirmation** after a successful appointment create, and a **reminder ~1 hour before** the appointment via **Vercel Cron** (every 2 hours). Email remains **optional** on the booking form with a soft UI hint; no email address means no automatic sends. Admins can **manually send** a booking email from the booking detail page with a custom recipient address. Templates use **React Email** styled with Averie theme tokens (`#2B2623`, `#D4C5B9`, `#F5EFEA`, `#FDFCFB`). From address: `Averie <noreply@averienails.com>` (domain already verified on Resend).

## Alternatives Considered

### Alternative A: React Email + Resend SDK (recommended)

- **Approach**: `@react-email/components` templates in `src/emails/`, `resend` npm package, send helpers in `src/server/email.server.ts`.
- **Pros**: Native Next.js pattern; easy theme alignment; Resend first-class Next.js docs; HTML preview in dev.
- **Cons**: New dependencies; templates are TSX not MJML.
- **Why chosen**: Best fit for Averie stack and branded templates.

### Alternative B: Port BRIX MJML + Resend

- **Approach**: Reuse MJML template pattern from BRIX-Server, swap SendGrid for Resend.
- **Pros**: Familiar from prior project; email-client-safe HTML via MJML compiler.
- **Cons**: Extra build step (`mjml` dependency); harder to share React theme tokens; duplicate styling maintenance.
- **Why not chosen**: React Email is simpler in App Router and matches component mental model.

### Alternative C: External cron (GitHub Actions / Bizfly curl)

- **Approach**: Scheduled workflow hits protected API route instead of Vercel Cron.
- **Pros**: Works on any host; user already has GitHub Actions.
- **Cons**: Extra infra when app is on Vercel; duplicate scheduling config.
- **Why not chosen**: User confirmed **Vercel-only** deployment with **Vercel Cron** built-in.

## Agreed Approach

**Alternative A** with **Vercel Cron** (`vercel.json` schedule every 2 hours → `GET /api/cron/booking-reminders`). Reminder job queries `upcoming` bookings whose salon-local start time falls in a **45–135 minute** window and have not received a reminder yet. Confirmation sends fire-and-forget after successful `createBookingAction` when `customer.email` is present. Booking creation MUST NOT fail if email send fails (log + optional retry field). Admin manual send via `sendBookingEmailAction` (Server Action, admin-only).

## Key Decisions

| Decision                              | Choice                                                   |
| ------------------------------------- | -------------------------------------------------------- |
| Email on booking form                 | Optional; helper text encourages entry for confirmations |
| Auto-send without email               | Skip silently                                            |
| Provider                              | Resend (`RESEND_API_KEY`)                                |
| From                                  | `noreply@averienails.com`                                |
| Templates                             | React Email, Averie warm-neutral theme                   |
| Cron                                  | Vercel Cron, every 2h                                    |
| Reminder target                       | ~1h before (window accommodates 2h cadence)              |
| Idempotency                           | `confirmationSentAt`, `reminderSentAt` on Booking        |
| Admin UI                              | Send-email modal on `/admin/bookings/[id]`               |
| Booking create failure on email error | No — booking succeeds, email failure logged              |
| Timezone                              | `SALON_TIMEZONE` (America/New_York) for reminder window  |

## Open Questions

- None blocking v1. Marketing broadcasts / SMS reminders remain out of scope.
