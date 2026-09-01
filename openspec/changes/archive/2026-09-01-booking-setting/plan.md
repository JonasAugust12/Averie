# Booking Setting (Public Pause Toggle) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let admins toggle public online booking off via schedule settings; show a non-dismissible blurred overlay on `/book`; enforce 403 on public slot/create APIs while admin manual booking still works.

**Architecture:** Add `bookingEnabled` boolean to singleton `SalonSettings`, extend existing schedule settings GET/update/mapper/DTO pipeline, guard `createBookingAction` and slots route server-side, render `BookingPausedOverlay` in `BookPageView` when flag is false.

**Tech Stack:** Next.js 15 App Router, MongoDB/Mongoose, Zod, TanStack Query, next-intl (en/vi), Tailwind CSS 4, Server Actions + Route Handlers per Averie conventions.

## Global Constraints

- GET reads → Route Handlers in `src/app/api/**`
- POST/PUT/PATCH/DELETE mutations → Server Actions in `src/actions/**`
- Response envelope: `{ status: number, message: string, data: T | null }`
- Path aliases: `@actions`, `@services`, `@validations`, `@components`, `@server`, `@utils`, `@typings`, `@mappers`
- Default `bookingEnabled: true` for backward compatibility
- Admin bypass only (role `admin`), not staff
- No custom admin message in v1 — i18n static copy only

---

## File Map

| File                                              | Responsibility                    |
| ------------------------------------------------- | --------------------------------- |
| `src/models/salon-settings.model.ts`              | Persist `bookingEnabled`          |
| `src/types/schedule-settings.type.ts`             | DTO field                         |
| `src/validations/schedule-settings.schema.ts`     | Zod update input                  |
| `src/mappers/schedule.mapper.ts`                  | Serialize with default true       |
| `src/server/schedule.server.ts`                   | `isPublicBookingEnabled()` helper |
| `src/actions/booking.action.ts`                   | Admin-aware 403 guard             |
| `src/app/api/bookings/slots/route.ts`             | Public 403 guard                  |
| `src/components/booking/BookingPausedOverlay.tsx` | Modal overlay UI                  |
| `src/components/booking/BookPageView.tsx`         | Integrate overlay                 |
| `src/app/admin/settings/schedule/page.tsx`        | Admin toggle                      |
| `messages/en                                      | vi/booking.json`                  | Guest copy          |
| `messages/en                                      | vi/admin.json`                    | Admin toggle labels |
| `src/openapi/schemas/schedule.schema.ts`          | OpenAPI DTO                       |

---

### Task 1: Persistence and DTO [db]

**Files:**

- Modify: `src/models/salon-settings.model.ts`
- Modify: `src/types/schedule-settings.type.ts`
- Modify: `src/validations/schedule-settings.schema.ts`
- Modify: `src/mappers/schedule.mapper.ts`
- Modify: `src/openapi/schemas/schedule.schema.ts`
- Modify: `src/openapi/examples/schedule.examples.ts`

**Interfaces:**

- Produces: `ScheduleSettingsDto.bookingEnabled: boolean`
- Produces: `updateScheduleSettingsSchema` accepts optional `bookingEnabled: boolean`

- [ ] **Step 1:** Add to Mongoose schema after `allowGuestLanguageSwitch`:

```typescript
bookingEnabled: {
    type: Boolean,
    default: true,
},
```

- [ ] **Step 2:** Extend `ScheduleSettingsDto`:

```typescript
export interface ScheduleSettingsDto {
    // ...existing fields
    bookingEnabled: boolean;
}
```

- [ ] **Step 3:** Extend Zod schema:

```typescript
export const updateScheduleSettingsSchema = z.object({
    allowStaffSelection: z.boolean().optional(),
    allowGuestLanguageSwitch: z.boolean().optional(),
    bookingEnabled: z.boolean().optional(),
    // ...rest unchanged
});
```

- [ ] **Step 4:** In `serializeScheduleSettings`, add:

```typescript
bookingEnabled: doc.bookingEnabled !== false,
```

- [ ] **Step 5:** Add `bookingEnabled: true` to `scheduleSettingsExample` and `scheduleSettingsDtoSchema`.

- [ ] **Step 6:** Run `pnpm type-check` — expect pass after all Task 1 files updated.

- [ ] **Step 7:** Commit

```bash
git add src/models/salon-settings.model.ts src/types/schedule-settings.type.ts src/validations/schedule-settings.schema.ts src/mappers/schedule.mapper.ts src/openapi/schemas/schedule.schema.ts src/openapi/examples/schedule.examples.ts
git commit -m "feat(settings): add bookingEnabled to salon settings model and DTO"
```

---

### Task 2: Server helpers and API guards [action] [api]

**Files:**

- Modify: `src/server/schedule.server.ts`
- Modify: `src/actions/booking.action.ts`
- Modify: `src/app/api/bookings/slots/route.ts`

**Interfaces:**

- Produces: `export async function isPublicBookingEnabled(): Promise<boolean>`

- [ ] **Step 1:** Add helper in `schedule.server.ts`:

```typescript
export async function isPublicBookingEnabled(): Promise<boolean> {
    const settings = await getSalonSettingsDocument();
    return settings.bookingEnabled !== false;
}
```

- [ ] **Step 2:** Guard slots route — after parse success, before `getAvailableSlotsForDateServer`:

```typescript
import { isPublicBookingEnabled } from '@server/schedule.server';

if (!(await isPublicBookingEnabled())) {
    return apiError('Online booking is temporarily unavailable', 403);
}
```

- [ ] **Step 3:** Guard `createBookingAction` — at start of `try` block after parse, before staff validation:

```typescript
import { auth } from '@libs/auth';
import { isPublicBookingEnabled } from '@server/schedule.server';

const session = await auth();
const isAdmin = session?.user?.role === 'admin';

if (!(await isPublicBookingEnabled()) && !isAdmin) {
    return apiErrorResult<BookingDto>('Online booking is temporarily unavailable', 403);
}
```

- [ ] **Step 4:** Verify `updateScheduleSettingsAction` passes `parsed.data` including `bookingEnabled` via existing `findByIdAndUpdate` — no change needed if schema includes field.

- [ ] **Step 5:** Run `pnpm type-check`

- [ ] **Step 6:** Manual API test (dev server):
    - Set `bookingEnabled: false` in MongoDB or via admin after Task 4
    - `GET /api/bookings/slots?date=2026-09-05&serviceIds=<id>` → 403
    - Public `createBookingAction` via `/book` → toast error / 403

- [ ] **Step 7:** Commit

```bash
git add src/server/schedule.server.ts src/actions/booking.action.ts src/app/api/bookings/slots/route.ts
git commit -m "feat(booking): enforce public booking pause on slots and create"
```

---

### Task 3: BookingPausedOverlay component [ui]

**Files:**

- Create: `src/components/booking/BookingPausedOverlay.tsx`
- Modify: `src/components/booking/index.ts`
- Modify: `messages/en/booking.json`
- Modify: `messages/vi/booking.json`

**Interfaces:**

- Produces: `export function BookingPausedOverlay(): JSX.Element`

- [ ] **Step 1:** Add i18n keys:

```json
"paused": {
  "title": "Online booking unavailable",
  "body": "We're temporarily not accepting online appointments. Please call us or check back soon.",
  "ctaHome": "Back to home"
}
```

Vietnamese equivalent in `messages/vi/booking.json`.

- [ ] **Step 2:** Create overlay component:

```tsx
'use client';

import Link from 'next/link';
import { CalendarX } from 'lucide-react';
import { useBookingTranslations } from '@i18n/use-app-translations';
import { Button } from '@components/common';

export function BookingPausedOverlay() {
    const t = useBookingTranslations();

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-paused-title"
        >
            <div className="absolute inset-0 bg-stone-900/45 backdrop-blur-sm" aria-hidden />
            <div className="relative w-full max-w-md rounded-2xl border border-stone-200/90 bg-[#FCFAF6] p-6 sm:p-8 shadow-[0_24px_60px_-12px_rgba(43,38,35,0.25)]">
                <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-stone-200 bg-stone-100 text-stone-600">
                    <CalendarX className="size-7" aria-hidden />
                </div>
                <h2
                    id="booking-paused-title"
                    className="mt-5 text-center font-display text-xl font-bold text-stone-900 sm:text-2xl"
                >
                    {t('paused.title')}
                </h2>
                <p className="mt-3 text-center font-sans text-sm leading-relaxed text-stone-600 sm:text-base">
                    {t('paused.body')}
                </p>
                <Link href="/" className="mt-6 block">
                    <Button className="w-full rounded-full py-3 text-xs font-bold uppercase tracking-wider">
                        {t('paused.ctaHome')}
                    </Button>
                </Link>
            </div>
        </div>
    );
}
```

- [ ] **Step 3:** Export from `index.ts`:

```typescript
export { BookingPausedOverlay } from './BookingPausedOverlay';
```

- [ ] **Step 4:** Run `pnpm type-check`

- [ ] **Step 5:** Commit

```bash
git add src/components/booking/BookingPausedOverlay.tsx src/components/booking/index.ts messages/en/booking.json messages/vi/booking.json
git commit -m "feat(booking): add paused overlay component with i18n"
```

---

### Task 4: Integrate overlay in BookPageView [ui]

**Files:**

- Modify: `src/components/booking/BookPageView.tsx`

**Interfaces:**

- Consumes: `useScheduleSettings()`, `BookingPausedOverlay`
- Consumes: `ScheduleSettingsDto.bookingEnabled`

- [ ] **Step 1:** Import `BookingPausedOverlay`

- [ ] **Step 2:** Derive paused state:

```typescript
const { data: settings, isLoading: isSettingsLoading } = useScheduleSettings();
const isBookingPaused = settings?.bookingEnabled === false;
```

- [ ] **Step 3:** Wrap main return in fragment; apply to outer content wrapper:

```tsx
return (
    <>
        <div
            className={cn(
                'min-h-screen bg-background text-foreground',
                isBookingPaused && 'pointer-events-none select-none blur-[2px]',
            )}
            aria-hidden={isBookingPaused || undefined}
        >
            {/* existing BookPageView content */}
        </div>
        {isBookingPaused && !isSettingsLoading ? <BookingPausedOverlay /> : null}
    </>
);
```

- [ ] **Step 4:** Ensure step-guard `useEffect` does not fight overlay — optional: early return skeleton while `isSettingsLoading`.

- [ ] **Step 5:** Manual test mobile (375px) and desktop — overlay centered, backdrop blocks clicks, home link works.

- [ ] **Step 6:** Commit

```bash
git add src/components/booking/BookPageView.tsx
git commit -m "feat(booking): show paused overlay when online booking disabled"
```

---

### Task 5: Admin schedule toggle [ui] [auth]

**Files:**

- Modify: `src/app/admin/settings/schedule/page.tsx`
- Modify: `messages/en/admin.json`
- Modify: `messages/vi/admin.json`

- [ ] **Step 1:** Add admin i18n:

```json
"schedule": {
  "bookingEnabled": "Accept online bookings",
  "bookingEnabledDesc": "When off, guests see a closed message on /book. Admins can still create bookings manually."
}
```

(under existing `schedule` namespace if present, else add keys used by page)

- [ ] **Step 2:** Add toggle card at top of schedule settings form (after loading check):

```tsx
<div className="rounded-2xl border border-stone-200/80 bg-white p-4 sm:p-5">
    <div className="flex items-start justify-between gap-4">
        <div>
            <p className="font-sans text-sm font-bold text-stone-900">
                {t('schedule.bookingEnabled')}
            </p>
            <p className="mt-1 font-sans text-xs text-stone-500">
                {t('schedule.bookingEnabledDesc')}
            </p>
        </div>
        <button
            type="button"
            role="switch"
            aria-checked={form.bookingEnabled}
            onClick={() =>
                setForm((prev) => prev && { ...prev, bookingEnabled: !prev.bookingEnabled })
            }
            className={cn(
                'relative h-7 w-12 shrink-0 rounded-full transition-colors',
                form.bookingEnabled ? 'bg-emerald-600' : 'bg-stone-300',
            )}
        >
            <span
                className={cn(
                    'absolute top-0.5 size-6 rounded-full bg-white shadow transition-transform',
                    form.bookingEnabled ? 'left-5' : 'left-0.5',
                )}
            />
        </button>
    </div>
</div>
```

- [ ] **Step 3:** Include `bookingEnabled` in save payload (existing save handler should send full `form` or relevant fields — verify `handleSave` passes `bookingEnabled`).

- [ ] **Step 4:** Manual test: toggle off → save → `/book` overlay; admin New Booking modal still works.

- [ ] **Step 5:** Run `pnpm type-check && pnpm lint`

- [ ] **Step 6:** Commit

```bash
git add src/app/admin/settings/schedule/page.tsx messages/en/admin.json messages/vi/admin.json
git commit -m "feat(admin): add online booking toggle to schedule settings"
```

---

### Task 6: Final verification [ui]

- [ ] **Step 1:** Full manual checklist:
    - [ ] `bookingEnabled: true` (default) — wizard works end-to-end
    - [ ] Toggle off — overlay on `/book`, blur, no step clicks
    - [ ] DevTools delete overlay — create still 403
    - [ ] Slots API 403 when off
    - [ ] Admin modal creates booking when off
    - [ ] Toggle on — overlay gone, wizard works
    - [ ] EN/VI strings render
    - [ ] Mobile 375px layout OK

- [ ] **Step 2:** Run `pnpm build` — no errors

- [ ] **Step 3:** Commit any fixups if needed

---

## Spec Coverage Checklist

| Requirement                            | Task      |
| -------------------------------------- | --------- |
| `bookingEnabled` persistence           | Task 1    |
| Schedule GET/update exposes flag       | Task 1, 5 |
| Paused overlay UX                      | Task 3, 4 |
| createBookingAction 403 + admin bypass | Task 2    |
| Slots 403                              | Task 2    |
| Admin toggle UI                        | Task 5    |
| i18n                                   | Task 3, 5 |

## Execution Handoff

Plan complete and saved to `openspec/changes/booking-setting/plan.md`.

**Two execution options:**

1. **Subagent-Driven (recommended)** — dispatch fresh subagent per task, review between tasks
2. **Inline Execution** — run tasks in session via `/opsx-apply` or executing-plans with checkpoints

Which approach?
