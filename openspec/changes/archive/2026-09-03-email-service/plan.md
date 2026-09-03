# Email Service Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Resend-powered transactional email (confirmation on booking create, reminder via Vercel Cron, admin manual send) with optional customer email on the booking form.

**Architecture:** React Email templates render branded HTML; `src/server/email.server.ts` wraps Resend. Confirmation fires from `createBookingAction` when `customer.email` is set. Reminders run via `GET /api/cron/booking-reminders` every 2 hours on Vercel, querying bookings 45–135 minutes ahead in `SALON_TIMEZONE`. Admin sends via `sendBookingEmailAction` from booking detail modal.

**Tech Stack:** Next.js 15 App Router, Resend SDK, React Email, Mongoose 8, Vercel Cron, next-intl (en/vi)

## Global Constraints

- GET reads → Route Handlers in `src/app/api/*`; mutations → Server Actions in `src/actions/*`
- Response envelope: `{ status: number, message: string, data: T | null }`
- Email optional on booking form; no send when empty
- From address default: `Averie <noreply@averienails.com>`
- Deploy target: Vercel (single instance); cron schedule `0 */2 * * *`
- Theme colors: primary `#2B2623`, secondary `#D4C5B9`, tertiary `#F5EFEA`, neutral `#FDFCFB`
- Salon timezone: `SALON_TIMEZONE=America/New_York`
- Missing `RESEND_API_KEY` must skip send without breaking booking create

---

### Task 1: Dependencies and environment

**Files:**

- Modify: `package.json`
- Modify: `.env.example`

**Interfaces:**

- Consumes: none
- Produces: npm packages `resend`, `@react-email/components`, `@react-email/render`; documented env vars

- [ ] **Step 1: Install email packages**

Run:

```bash
pnpm add resend @react-email/components @react-email/render
```

Expected: packages appear in `package.json` dependencies.

- [ ] **Step 2: Add env vars to `.env.example`**

Append after the `SALON_TIMEZONE` block:

```bash
# -----------------------------------------------------------------------------
# Transactional email (Resend — server-only)
# -----------------------------------------------------------------------------
# Create at https://resend.com/api-keys (domain averienails.com must be verified)
RESEND_API_KEY=
# Default when unset: Averie <noreply@averienails.com>
EMAIL_FROM=Averie <noreply@averienails.com>
# Vercel Cron auth — generate: openssl rand -base64 32
CRON_SECRET=
```

- [ ] **Step 3: Verify install**

Run: `pnpm type-check`
Expected: PASS (no new type errors from packages)

- [ ] **Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml .env.example
git commit -m "chore: add Resend and React Email dependencies"
```

---

### Task 2: Persistence and DTO layer

**Files:**

- Modify: `src/models/booking.model.ts`
- Modify: `src/types/booking.type.ts`
- Modify: `src/mappers/booking.mapper.ts`

**Interfaces:**

- Consumes: none
- Produces: `Booking.emailNotifications.confirmationSentAt?`, `reminderSentAt?`; DTO field `emailNotifications?: { confirmationSentAt?: string; reminderSentAt?: string }`

- [ ] **Step 1: Extend Mongoose schema**

In `src/models/booking.model.ts`, add before `status`:

```typescript
emailNotifications: {
    confirmationSentAt: { type: Date },
    reminderSentAt: { type: Date },
},
```

- [ ] **Step 2: Extend BookingDto type**

In `src/types/booking.type.ts`, add interface and field:

```typescript
export interface BookingEmailNotificationsDto {
    confirmationSentAt?: string;
    reminderSentAt?: string;
}

// Inside BookingDto:
emailNotifications?: BookingEmailNotificationsDto;
```

- [ ] **Step 3: Map in serializer**

In `src/mappers/booking.mapper.ts`, extend input type and return:

```typescript
emailNotifications?: {
    confirmationSentAt?: Date | string | null;
    reminderSentAt?: Date | string | null;
} | null;
```

And in return object:

```typescript
emailNotifications: doc.emailNotifications
    ? {
          confirmationSentAt: toOptionalIso(doc.emailNotifications.confirmationSentAt),
          reminderSentAt: toOptionalIso(doc.emailNotifications.reminderSentAt),
      }
    : undefined,
```

- [ ] **Step 4: Verify types**

Run: `pnpm type-check`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/models/booking.model.ts src/types/booking.type.ts src/mappers/booking.mapper.ts
git commit -m "feat(db): add booking email notification timestamps"
```

---

### Task 3: Email templates and server helpers

**Files:**

- Create: `src/emails/components/EmailLayout.tsx`
- Create: `src/emails/BookingConfirmationEmail.tsx`
- Create: `src/emails/BookingReminderEmail.tsx`
- Create: `src/emails/types.ts`
- Create: `src/server/email.server.ts`

**Interfaces:**

- Consumes: `SEO` from `@libs/site-seo`, `BookingListItemDto`-like summary props
- Produces:
    - `sendBookingConfirmation(booking: EnrichedBookingEmailContext): Promise<boolean>`
    - `sendBookingReminder(booking: EnrichedBookingEmailContext): Promise<boolean>`
    - `sendBookingEmailToRecipient(params: { booking: EnrichedBookingEmailContext; to: string; template: 'confirmation' | 'reminder' }): Promise<boolean>`

- [ ] **Step 1: Create shared email context type**

Create `src/emails/types.ts`:

```typescript
export interface BookingEmailServiceLine {
    name: string;
    estimatedMinutes: number;
}

export interface EnrichedBookingEmailContext {
    reference: string;
    date: string;
    time: string;
    totalEstimatedMinutes: number;
    totalPrice: number;
    customer: {
        firstName: string;
        lastName: string;
    };
    services: BookingEmailServiceLine[];
}
```

- [ ] **Step 2: Create EmailLayout**

Create `src/emails/components/EmailLayout.tsx` using `@react-email/components` (`Html`, `Head`, `Body`, `Container`, `Section`, `Text`, `Hr`). Use inline styles: background `#FDFCFB`, card `#F5EFEA`, heading `#2B2623`, accent `#D4C5B9`. Footer with `SEO.address` and `SEO.phoneDisplay` from `@libs/site-seo`.

- [ ] **Step 3: Create confirmation template**

Create `src/emails/BookingConfirmationEmail.tsx`:

```typescript
import { Heading, Text } from '@react-email/components';
import { EmailLayout } from './components/EmailLayout';
import type { EnrichedBookingEmailContext } from './types';

export function BookingConfirmationEmail({ booking }: { booking: EnrichedBookingEmailContext }) {
    return (
        <EmailLayout preview={`Booking confirmed — ${booking.reference}`}>
            <Heading style={{ color: '#2B2623' }}>Your appointment is confirmed</Heading>
            <Text>Hi {booking.customer.firstName},</Text>
            <Text>Reference: {booking.reference}</Text>
            <Text>Date: {booking.date} at {booking.time}</Text>
            {/* list services, duration, price, salon address */}
        </EmailLayout>
    );
}
```

- [ ] **Step 4: Create reminder template**

Create `src/emails/BookingReminderEmail.tsx` — same structure, heading "Reminder: your appointment is coming up".

- [ ] **Step 5: Create email.server.ts**

Create `src/server/email.server.ts`:

```typescript
import { Resend } from 'resend';
import { render } from '@react-email/render';
import { BookingConfirmationEmail } from '@/emails/BookingConfirmationEmail';
import { BookingReminderEmail } from '@/emails/BookingReminderEmail';
import type { EnrichedBookingEmailContext } from '@/emails/types';

const DEFAULT_FROM = 'Averie <noreply@averienails.com>';

function getFromAddress() {
    return process.env.EMAIL_FROM?.trim() || DEFAULT_FROM;
}

function getResendClient() {
    const key = process.env.RESEND_API_KEY?.trim();
    if (!key) {
        console.warn('[email] RESEND_API_KEY missing — skipping send');
        return null;
    }
    return new Resend(key);
}

async function sendRendered(params: {
    to: string;
    subject: string;
    react: React.ReactElement;
}): Promise<boolean> {
    const resend = getResendClient();
    if (!resend) return false;
    const html = await render(params.react);
    const { error } = await resend.emails.send({
        from: getFromAddress(),
        to: params.to,
        subject: params.subject,
        html,
    });
    if (error) {
        console.error('[email] Resend error:', error);
        return false;
    }
    return true;
}

export async function sendBookingConfirmation(
    to: string,
    booking: EnrichedBookingEmailContext,
): Promise<boolean> {
    return sendRendered({
        to,
        subject: `Averie — Booking confirmed (${booking.reference})`,
        react: BookingConfirmationEmail({ booking }),
    });
}

export async function sendBookingReminder(
    to: string,
    booking: EnrichedBookingEmailContext,
): Promise<boolean> {
    return sendRendered({
        to,
        subject: `Averie — Appointment reminder (${booking.reference})`,
        react: BookingReminderEmail({ booking }),
    });
}

export async function sendBookingEmailToRecipient(params: {
    to: string;
    template: 'confirmation' | 'reminder';
    booking: EnrichedBookingEmailContext;
}): Promise<boolean> {
    if (params.template === 'reminder') {
        return sendBookingReminder(params.to, params.booking);
    }
    return sendBookingConfirmation(params.to, params.booking);
}
```

Add helper `buildBookingEmailContextFromDoc(...)` in same file or `src/utils/booking-email.util.ts` to map enriched booking + services.

- [ ] **Step 6: Verify compile**

Run: `pnpm type-check`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/emails src/server/email.server.ts
git commit -m "feat: add React Email templates and Resend send helpers"
```

---

### Task 4: Booking create confirmation trigger

**Files:**

- Modify: `src/actions/booking.action.ts`
- Create (optional): `src/utils/booking-email.util.ts`

**Interfaces:**

- Consumes: `sendBookingConfirmation`, context builder from Task 3
- Produces: `createBookingAction` sets `confirmationSentAt` on successful send

- [ ] **Step 1: Add post-create email hook**

In `src/actions/booking.action.ts`, after `Booking.create` and before return:

```typescript
const dto = serializeBooking(created.toObject());

if (data.customer.email) {
    try {
        const emailContext = await buildBookingEmailContext(created);
        const sent = await sendBookingConfirmation(data.customer.email, emailContext);
        if (sent) {
            await Booking.findByIdAndUpdate(created._id, {
                'emailNotifications.confirmationSentAt': new Date(),
            });
            dto.emailNotifications = {
                confirmationSentAt: new Date().toISOString(),
            };
        }
    } catch (emailError) {
        console.error('[createBookingAction] confirmation email failed', emailError);
    }
}

return apiSuccessResult(dto, 'Booking created', 201);
```

Implement `buildBookingEmailContext` by loading service names via existing booking enrichment pattern (query `Service.find({ _id: { $in: serviceIds } })`).

- [ ] **Step 2: Manual verify without API key**

Run: `pnpm dev`, create booking without email → 201, no error.
Create with email but no `RESEND_API_KEY` → 201, console warning, no crash.

- [ ] **Step 3: Commit**

```bash
git add src/actions/booking.action.ts src/utils/booking-email.util.ts
git commit -m "feat: send confirmation email on booking create when email provided"
```

---

### Task 5: Reminder cron route

**Files:**

- Create: `src/app/api/cron/booking-reminders/route.ts`
- Create: `src/utils/booking-reminder.util.ts`
- Create: `vercel.json`

**Interfaces:**

- Consumes: `sendBookingReminder`, `SALON_TIMEZONE` from `@utils/booking-schedule.util`
- Produces: `GET /api/cron/booking-reminders` → `{ status: 200, message, data: { sent: number, skipped: number } }`

- [ ] **Step 1: Create reminder window helper**

Create `src/utils/booking-reminder.util.ts`:

```typescript
import { SALON_TIMEZONE } from '@utils/booking-schedule.util';

export function getReminderWindow(now = new Date()) {
    const minAheadMs = 45 * 60 * 1000;
    const maxAheadMs = 135 * 60 * 1000;
    return {
        windowStart: new Date(now.getTime() + minAheadMs),
        windowEnd: new Date(now.getTime() + maxAheadMs),
        timezone: SALON_TIMEZONE,
    };
}

/** Convert booking date+time in salon TZ to UTC Date for comparison */
export function bookingStartToDate(date: string, time: string): Date {
    // Use Intl or Temporal-safe parse: `${date}T${time}:00` with timeZone SALON_TIMEZONE
    const local = `${date}T${time}:00`;
    return new Date(new Date(local).toLocaleString('en-US', { timeZone: SALON_TIMEZONE }));
}
```

Implement robust parse using existing patterns from `booking-schedule.util.ts`.

- [ ] **Step 2: Create cron route**

Create `src/app/api/cron/booking-reminders/route.ts`:

```typescript
import { connectToDatabase } from '@libs/mongodb';
import { Booking } from '@models/booking.model';
import { apiError, apiSuccess } from '../../_lib/http';
import { sendBookingReminder } from '@server/email.server';
import { buildBookingEmailContextFromLean } from '@utils/booking-email.util';
import { bookingStartToDate, getReminderWindow } from '@utils/booking-reminder.util';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function isAuthorized(request: Request) {
    const secret = process.env.CRON_SECRET?.trim();
    if (!secret) return false;
    const auth = request.headers.get('authorization');
    return auth === `Bearer ${secret}`;
}

export async function GET(request: Request) {
    if (!isAuthorized(request)) {
        return apiError('Unauthorized', 401);
    }

    await connectToDatabase();
    const { windowStart, windowEnd } = getReminderWindow();
    const candidates = await Booking.find({
        status: 'upcoming',
        'customer.email': { $exists: true, $nin: [null, ''] },
        'emailNotifications.reminderSentAt': { $exists: false },
    }).lean();

    let sent = 0;
    let skipped = 0;

    for (const doc of candidates) {
        const start = bookingStartToDate(doc.date, doc.time);
        if (start < windowStart || start > windowEnd) {
            skipped += 1;
            continue;
        }
        try {
            const ctx = await buildBookingEmailContextFromLean(doc);
            const ok = await sendBookingReminder(doc.customer.email!, ctx);
            if (ok) {
                await Booking.findByIdAndUpdate(doc._id, {
                    'emailNotifications.reminderSentAt': new Date(),
                });
                sent += 1;
            } else {
                skipped += 1;
            }
        } catch (err) {
            console.error('[cron/booking-reminders]', doc.reference, err);
            skipped += 1;
        }
    }

    return apiSuccess({ sent, skipped }, 'Reminder batch complete');
}
```

- [ ] **Step 3: Add vercel.json**

Create `vercel.json`:

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

- [ ] **Step 4: Local smoke test cron auth**

Run with dev server:

```bash
curl -i http://localhost:3000/api/cron/booking-reminders
```

Expected: `401 Unauthorized`

```bash
curl -i -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/booking-reminders
```

Expected: `200` with `{ sent, skipped }`

- [ ] **Step 5: Commit**

```bash
git add src/app/api/cron/booking-reminders/route.ts src/utils/booking-reminder.util.ts vercel.json
git commit -m "feat: add Vercel cron route for booking reminder emails"
```

---

### Task 6: Admin manual send

**Files:**

- Create: `src/actions/booking-email.action.ts`
- Create: `src/validations/booking-email.schema.ts`
- Modify: `src/services/booking.service.ts`
- Modify: `src/app/admin/bookings/[id]/page.tsx`
- Create: `src/components/admin/bookings/SendBookingEmailModal.tsx`

**Interfaces:**

- Consumes: `sendBookingEmailToRecipient`, enriched booking from `GET /api/bookings/:id`
- Produces: `sendBookingEmailAction(input: SendBookingEmailInput): Promise<ApiResponse<null>>`

- [ ] **Step 1: Create Zod schema**

Create `src/validations/booking-email.schema.ts`:

```typescript
import { z } from 'zod';

export const sendBookingEmailSchema = z.object({
    bookingId: z.string().min(1),
    to: z.string().email(),
    template: z.enum(['confirmation', 'reminder']),
});

export type SendBookingEmailInput = z.infer<typeof sendBookingEmailSchema>;
```

- [ ] **Step 2: Create server action**

Create `src/actions/booking-email.action.ts`:

```typescript
'use server';

import { requireAdmin } from '@guard/auth-guard';
import { apiErrorResult, apiSuccessResult, parseActionInput } from '@libs/action.util';
import { connectToDatabase } from '@libs/mongodb';
import { Booking } from '@models/booking.model';
import { sendBookingEmailToRecipient } from '@server/email.server';
import { buildBookingEmailContextFromLean } from '@utils/booking-email.util';
import { sendBookingEmailSchema } from '@validations/booking-email.schema';

export async function sendBookingEmailAction(input: unknown) {
    const authError = await requireAdmin<null>();
    if (authError) return authError;

    const parsed = parseActionInput(sendBookingEmailSchema, input);
    if (parsed.status >= 400 || !parsed.data) {
        return apiErrorResult<null>(parsed.message, parsed.status);
    }

    await connectToDatabase();
    const booking = await Booking.findById(parsed.data.bookingId).lean();
    if (!booking) {
        return apiErrorResult<null>('Booking not found', 404);
    }

    const ctx = await buildBookingEmailContextFromLean(booking);
    const sent = await sendBookingEmailToRecipient({
        to: parsed.data.to,
        template: parsed.data.template,
        booking: ctx,
    });

    if (!sent) {
        return apiErrorResult<null>('Failed to send email', 502);
    }

    return apiSuccessResult(null, 'Email sent');
}
```

- [ ] **Step 3: Add service hook**

In `src/services/booking.service.ts`:

```typescript
import { sendBookingEmailAction } from '@actions/booking-email.action';

export function useSendBookingEmail() {
    const queryClient = useQueryClient();
    return useAppMutation({
        mutationFn: (input: SendBookingEmailInput) => sendBookingEmailAction(input),
        onSuccess: (_, vars) => {
            queryClient.invalidateQueries({ queryKey: ['bookings', vars.bookingId] });
        },
    });
}
```

- [ ] **Step 4: Create SendBookingEmailModal component**

Modal with react-hook-form + Zod: fields `to` (prefill `booking.customer.email`), `template` select (`confirmation` | `reminder`), read-only summary (reference, date, time). Use existing `Button`, admin stone/cream styling.

- [ ] **Step 5: Wire into booking detail page**

In `src/app/admin/bookings/[id]/page.tsx`, add Mail icon button next to cancel/restore that opens `SendBookingEmailModal`.

- [ ] **Step 6: Manual verify**

Log in as admin → open booking detail → send to test inbox → success toast.

- [ ] **Step 7: Commit**

```bash
git add src/actions/booking-email.action.ts src/validations/booking-email.schema.ts src/services/booking.service.ts src/components/admin/bookings/SendBookingEmailModal.tsx src/app/admin/bookings/[id]/page.tsx
git commit -m "feat: admin manual booking email send from detail page"
```

---

### Task 7: Booking wizard optional-email UX

**Files:**

- Modify: `src/components/booking/CustomerStep.tsx`
- Modify: `messages/en/booking.json`
- Modify: `messages/vi/booking.json`
- Modify: `messages/en/admin.json`
- Modify: `messages/vi/admin.json`

**Interfaces:**

- Consumes: existing optional email Zod validation (unchanged)
- Produces: helper text visible under email input; admin modal i18n keys

- [ ] **Step 1: Add en booking helper text**

In `messages/en/booking.json` under `customer`:

```json
"emailHelper": "Optional — enter your email to receive automatic confirmation and a reminder before your appointment."
```

- [ ] **Step 2: Add vi booking helper text**

In `messages/vi/booking.json`:

```json
"emailHelper": "Không bắt buộc — nhập email để nhận xác nhận và nhắc lịch tự động trước giờ hẹn."
```

- [ ] **Step 3: Render helper in CustomerStep**

After email input error block, add:

```tsx
<p className="font-sans text-xs text-stone-500 pl-1">{t('customer.emailHelper')}</p>
```

- [ ] **Step 4: Add admin i18n keys**

In `messages/en/admin.json` under `bookings`:

```json
"sendEmail": {
    "button": "Send email",
    "title": "Send booking email",
    "recipient": "Recipient email",
    "template": "Template",
    "templateConfirmation": "Confirmation",
    "templateReminder": "Reminder",
    "submit": "Send",
    "success": "Email sent successfully"
}
```

Mirror in `messages/vi/admin.json`.

- [ ] **Step 5: Commit**

```bash
git add src/components/booking/CustomerStep.tsx messages/en/booking.json messages/vi/booking.json messages/en/admin.json messages/vi/admin.json
git commit -m "feat: add optional email helper text and admin send-email i18n"
```

---

### Task 8: Documentation and verification

**Files:**

- Create: `docs/email-resend-setup.md`

**Interfaces:**

- Consumes: all prior tasks
- Produces: operator setup guide

- [ ] **Step 1: Write setup doc**

Create `docs/email-resend-setup.md` covering:

1. Resend dashboard → API key
2. Domain `averienails.com` verification checklist
3. Env vars: `RESEND_API_KEY`, `EMAIL_FROM`, `CRON_SECRET`, `SALON_TIMEZONE`
4. Vercel project env + `vercel.json` cron (Pro plan note)
5. Smoke test: booking with email, curl cron with Bearer token, admin manual send

- [ ] **Step 2: Run quality gates**

```bash
pnpm type-check
pnpm lint
pnpm build
```

Expected: all PASS

- [ ] **Step 3: Manual QA checklist**

- [ ] Booking without email → 201, no Resend call
- [ ] Booking with email + valid key → confirmation received, `confirmationSentAt` set
- [ ] Cron unauthorized → 401
- [ ] Cron authorized → processes window, sets `reminderSentAt`
- [ ] Admin send modal → email delivered

- [ ] **Step 4: Commit**

```bash
git add docs/email-resend-setup.md
git commit -m "docs: add Resend email setup guide"
```

---

## Self-Review

**Spec coverage:**

- Resend config + graceful skip → Task 3, 4
- Branded templates → Task 3
- Cron route + auth + window → Task 5
- Setup docs → Task 8
- Optional email UX → Task 7
- Confirmation on create → Task 4
- Admin manual send → Task 6
- `emailNotifications` persistence → Task 2

**Placeholder scan:** No TBD/TODO placeholders.

**Type consistency:** `sendBookingConfirmation(to, booking)`, `sendBookingReminder(to, booking)`, `sendBookingEmailAction({ bookingId, to, template })`, DTO `emailNotifications.confirmationSentAt` / `reminderSentAt` aligned across tasks.
