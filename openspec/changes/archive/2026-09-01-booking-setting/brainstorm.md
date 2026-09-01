## Design Summary

Salon operators need to temporarily pause **public online booking** (maintenance, holidays, staffing) without a code deploy. A single boolean `bookingEnabled` on the existing singleton `salon_settings` document controls whether guests can use `/book`. When disabled, the booking wizard shows a **full-viewport modal overlay** (blurred backdrop, `pointer-events-none` on underlying content, responsive mobile layout) with i18n copy such as “Online booking is temporarily unavailable — we’ll be back soon.” **Server-side guards** on `createBookingAction` and public slot reads reject guest booking even if the overlay is removed via DevTools. **Admin booking** via `AdminNewBookingModal` remains allowed.

## Alternatives Considered

### Alternative A: New `/admin/settings/booking` tab

- **Approach**: Dedicated settings page and GET `/api/settings/booking`.
- **Pros**: Clear separation; room for future fields (custom message, reopen date).
- **Cons**: Extra nav tab, API surface, and hooks for one boolean; booking flow already reads schedule settings.
- **Why not chosen**: YAGNI — one toggle fits naturally on Operating Schedule settings beside `allowStaffSelection`.

### Alternative B: Redirect `/book` to landing with toast

- **Approach**: Server redirect when disabled instead of in-page overlay.
- **Pros**: Simple routing; no modal component.
- **Cons**: Poor UX (user leaves booking context); landing CTAs still misleading; harder to show focused “closed” message.
- **Why not chosen**: User explicitly requested popup + blur overlay on the booking page.

### Alternative C: Block only `createBookingAction` (no UI overlay)

- **Approach**: API-only guard; wizard stays interactive until submit fails.
- **Pros**: Minimal UI work.
- **Cons**: Guests waste time in wizard; fails user requirement for visible closed state and click blocking.
- **Why not chosen**: Does not meet overlay UX or “pointer-events-none” requirement.

## Agreed Approach

**Alternative A variant (minimal)**: Add `bookingEnabled` to `SalonSettings` and extend existing schedule settings GET/update pipeline. Show `BookingPausedOverlay` in `BookPageView` when false. Guard public mutations/reads; **admin bypass** on create booking.

## Key Decisions

1. **Field**: `bookingEnabled: boolean`, default `true`, root level on `SalonSettings`.
2. **Admin UI**: Toggle on `/admin/settings/schedule` (Operating Schedule), same save flow as other schedule fields.
3. **Public UX**: Non-dismissible modal overlay on `/book` and `/book/confirmation` (except lookup still works for existing references — confirmation uses reference from store, not new bookings).
4. **Server guard**: `createBookingAction` returns 403 when `bookingEnabled === false` and caller is not admin. `GET /api/bookings/slots` returns 403 for public when disabled.
5. **Admin bypass**: Authenticated admin session skips booking-disabled check in `createBookingAction`.
6. **Copy**: Static i18n strings in `messages/{en,vi}/booking.json` (no custom admin message in v1).
7. **Landing CTAs**: No change in v1 — links to `/book` show overlay (acceptable scope).

## Open Questions

- None blocking v1. Future: optional admin-editable message, hide landing “Book now” CTAs when disabled.
