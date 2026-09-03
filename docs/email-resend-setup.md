# Resend transactional email setup (Averie)

This guide covers Resend configuration for booking confirmation emails, appointment reminders (Vercel Cron), and admin manual sends.

## Prerequisites

- Resend account: https://resend.com
- Verified sending domain: `averienails.com`
- Vercel project (Cron Jobs work on **all plans**; Hobby allows **once per day** only)

## 1. Resend API key

1. Sign in to Resend → **API Keys** → **Create API Key**
2. Scope: **Sending access** (full access is fine for server-side use)
3. Copy the key — it is shown once

## 2. Domain verification

Ensure `averienails.com` shows **Verified** under Resend → **Domains**.

Default from address:

```text
Averie <noreply@averienails.com>
```

Override with `EMAIL_FROM` if needed.

## 3. Environment variables

Add to `.env.local` (local) and Vercel → **Project Settings → Environment Variables** (Production + Preview):

| Variable         | Required   | Description                                 |
| ---------------- | ---------- | ------------------------------------------- |
| `RESEND_API_KEY` | Yes (prod) | Resend API key                              |
| `EMAIL_FROM`     | No         | Default: `Averie <noreply@averienails.com>` |
| `CRON_SECRET`    | Yes (prod) | Bearer token for cron route auth            |
| `SALON_TIMEZONE` | No         | Default: `America/New_York`                 |

Generate `CRON_SECRET`:

```bash
openssl rand -base64 32
```

When `RESEND_API_KEY` is missing, sends are skipped with a console warning — booking create still succeeds.

## 4. Vercel Cron

`vercel.json` schedules reminder processing **once per day** (Hobby-compatible):

```json
{
    "crons": [
        {
            "path": "/api/cron/booking-reminders",
            "schedule": "0 3 * * *"
        }
    ]
}
```

`0 3 * * *` runs at **03:00 UTC** daily — approximately **10 PM US Eastern** the evening before the appointment (±1 hour during daylight saving).

Vercel sends `Authorization: Bearer <CRON_SECRET>` when invoking the route. Set the same value in project env vars.

**Selection rule:** upcoming bookings whose **appointment date is tomorrow** (salon timezone), with `customer.email` set and `reminderSentAt` unset. Sends only during the evening window (default: salon-local hour ≥ 21).

Optional: `BOOKING_REMINDER_SEND_AFTER_HOUR=21` (default) — earliest salon-local hour to send night-before reminders.

## 5. Local and Bizfly (non-Vercel)

`vercel.json` cron is **ignored** outside Vercel. Choose one:

### Option A — Internal scheduler (recommended for Bizfly Docker)

Set in `.env.local`, Bizfly `app.env`, or container env:

```env
BOOKING_REMINDER_CRON_MODE=internal
RESEND_API_KEY=re_xxxxxxxx
CRON_SECRET=your-secret          # still used if you curl the HTTP route
# Optional:
# BOOKING_REMINDER_CRON_INTERVAL_MS=86400000  # default 2h; use 24h for night-before on Bizfly
# BOOKING_REMINDER_CRON_RUN_ON_START=true     # run once on server boot
# BOOKING_REMINDER_SEND_AFTER_HOUR=21         # evening send window (salon local)
```

The app starts an in-process timer via `src/instrumentation.ts` when the Node server boots (`pnpm start` or Docker). **Do not** enable on Vercel — use external cron there instead.

### Option B — External HTTP cron (curl / system crontab)

Keep the default (omit `BOOKING_REMINDER_CRON_MODE` or set `external`). Schedule something to call the route:

```bash
0 3 * * * curl -sf -H "Authorization: Bearer $CRON_SECRET" https://your-domain.com/api/cron/booking-reminders
```

Schedule near **10 PM salon-local** (adjust UTC for `America/New_York`). On Bizfly, add the line above to the server crontab or a systemd timer.

## 6. Smoke tests

### Confirmation on booking create

1. Set `RESEND_API_KEY` in `.env.local`
2. Run `pnpm dev`
3. Complete `/book` with a real email address
4. Check inbox for confirmation; booking should have `emailNotifications.confirmationSentAt`

### Booking without email

1. Create a booking leaving email empty
2. Expect 201 response and no email attempt

### Cron route (local)

```bash
curl -i http://localhost:3000/api/cron/booking-reminders
# Expect 401

curl -i -H "Authorization: Bearer YOUR_CRON_SECRET" http://localhost:3000/api/cron/booking-reminders
# Expect 200 with { sent, skipped }
```

### Admin manual send

1. Log in as admin → `/admin/bookings/[id]`
2. Click **Send email**, enter recipient, choose template
3. Confirm success toast and email delivery

### Internal scheduler (local / Bizfly)

1. Set `BOOKING_REMINDER_CRON_MODE=internal` and `BOOKING_REMINDER_CRON_RUN_ON_START=true`
2. Run `pnpm build && pnpm start` (instrumentation runs on production server)
3. Check logs for `[booking-reminder-cron] internal scheduler enabled`

## 7. Troubleshooting

| Symptom           | Check                                                                                                                |
| ----------------- | -------------------------------------------------------------------------------------------------------------------- |
| No emails in dev  | `RESEND_API_KEY` set? Check server logs for `[email]` warnings                                                       |
| Cron returns 401  | `CRON_SECRET` matches Authorization header                                                                           |
| Reminder not sent | Booking **tomorrow** in salon TZ? `customer.email` present? `reminderSentAt` unset? Cron ran after 9 PM salon-local? |
| Resend 403        | Domain not verified or from address not on verified domain                                                           |

## Related code

- Send helpers: `src/server/email.server.ts`
- Templates: `src/emails/`
- Confirmation trigger: `src/actions/booking.action.ts`
- Cron route: `src/app/api/cron/booking-reminders/route.ts`
- Batch logic: `src/server/booking-reminder-batch.server.ts`
- Internal scheduler: `src/server/booking-reminder-cron.server.ts` (enabled with `BOOKING_REMINDER_CRON_MODE=internal`)
- Admin action: `src/actions/booking-email.action.ts`
