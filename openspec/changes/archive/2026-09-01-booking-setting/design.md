## Context

Averie stores salon configuration in a singleton MongoDB `salon_settings` document (`SalonSettings` model). Schedule settings already expose `allowStaffSelection` and `allowGuestLanguageSwitch` via `GET /api/settings/schedule` and `updateScheduleSettingsAction`. The public booking wizard (`BookPageView`) already calls `useScheduleSettings()`. Promotion settings demonstrate a boolean `enabled` toggle pattern in admin UI.

Stakeholders: salon operator (toggle booking on/off), public visitors (see closed state on `/book`), admin (still creates bookings manually).

## Goals / Non-Goals

**Goals:**

- Admin can disable/enable public online booking with one toggle in schedule settings.
- When disabled, `/book` shows a responsive modal overlay (blur + blocked interaction behind).
- Public `createBookingAction` and slot availability reads are rejected server-side.
- Admin `AdminNewBookingModal` continues to create bookings when public booking is off.
- EN/VI i18n for overlay copy and admin toggle labels.

**Non-Goals:**

- Custom admin-editable closed message (use i18n defaults).
- Disabling landing “Book now” links or search-by-reference.
- Staff-portal booking creation (staff uses same public action today — out of scope unless staff modal added later).
- Scheduled auto-reopen dates.

## Decisions

### 1. Data model — `bookingEnabled` on `SalonSettings`

```typescript
bookingEnabled: { type: Boolean, default: true }
```

Extend `ScheduleSettingsDto`, Zod `updateScheduleSettingsSchema`, and `serializeScheduleSettings` mapper.

**Rationale:** Booking wizard already fetches schedule settings; avoids new API/hook.

### 2. Admin UI — toggle on Schedule settings page

Add a “Online booking” card at top of `/admin/settings/schedule` with a switch bound to `form.bookingEnabled`, saved with existing `updateScheduleSettingsAction`.

**Rationale:** Operational control lives next to hours/day-offs; no fourth settings tab for one boolean.

### 3. Public overlay — `BookingPausedOverlay`

New component `@components/booking/BookingPausedOverlay.tsx`:

```
┌─────────────────────────────────────────────┐
│  BookPageView (pointer-events-none blur)    │
│  ┌─────────────────────────────────────┐    │
│  │ fixed inset-0 z-50 flex center      │    │
│  │ backdrop: bg-stone-900/40 backdrop-blur│  │
│  │ card: rounded-2xl, max-w-md, padding │    │
│  │ icon + title + body + link home      │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

- Wrapper around wizard: `aria-hidden={paused}` + `inert` on background when supported.
- Overlay: `role="dialog"`, `aria-modal="true"`, no close button (non-dismissible).
- Mobile: full-width card with safe-area padding; tap targets ≥ 44px.
- Theme: Averie tokens (`cream`, `stone`, `font-display`).

`BookPageView` renders overlay when `settings && settings.bookingEnabled === false`.

### 4. Server guards

**Helper** `assertPublicBookingOpen()` in `@server/schedule.server.ts` or `@utils/booking-availability.util.ts`:

```typescript
export async function isPublicBookingEnabled(): Promise<boolean> {
    const doc = await getSalonSettingsDocument();
    return doc.bookingEnabled !== false; // default true for legacy docs
}
```

| Operation                 | Guard                                                |
| ------------------------- | ---------------------------------------------------- |
| `createBookingAction`     | If `!bookingEnabled` and caller is not admin → `403` |
| `GET /api/bookings/slots` | If `!bookingEnabled` → `403` with message            |

Admin detection: `requireAdmin` pattern — use `auth()` and check `session?.user?.role === 'admin'` without requiring full admin guard (create action is public for guests).

**Rationale:** Client overlay is UX only; API must enforce.

### 5. Confirmation page

`/book/confirmation` after successful booking is fine. Direct navigation to `/book` when disabled shows overlay. No new booking can be created while disabled.

### 6. i18n keys (`messages/*/booking.json`)

- `paused.title` — “Online booking unavailable”
- `paused.body` — “We're temporarily not accepting online appointments…”
- `paused.ctaHome` — “Back to home”

Admin (`messages/*/admin.json`):

- `schedule.bookingEnabled` / `schedule.bookingEnabledDesc`

## Risks / Trade-offs

| Risk                                      | Mitigation                                          |
| ----------------------------------------- | --------------------------------------------------- |
| User removes overlay via DevTools         | Server rejects create + slots                       |
| Legacy DB docs missing field              | Treat undefined as `true` in mapper                 |
| Stale TanStack cache shows wizard briefly | Overlay when `settings` loaded; skeleton until then |
| Admin forgets toggle is off               | Admin UI shows clear ON/OFF label + desc            |

## Migration Plan

1. Deploy schema default `bookingEnabled: true` — no migration script needed.
2. Existing salons continue accepting bookings until admin toggles off.
3. Rollback: set field true in DB or revert deploy.

## Open Questions

None for v1.
