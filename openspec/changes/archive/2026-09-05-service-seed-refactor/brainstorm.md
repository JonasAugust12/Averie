## Design Summary

Unify the Averie service catalog around **12 flat categories** matching the salon PDF / Astro `price-list.ts`, extend `ServiceCategory` with marketing metadata, seed the full menu (~55 services) with estimated durations, and add an API-driven **LandingPriceList** section on the Next.js landing page. Booking, admin, and landing all consume the same `GET /api/service-categories` catalog — one source of truth.

## Alternatives Considered

### Alternative A: 12 flat categories (1:1 with PDF/Astro)

- **Approach**: One MongoDB category per treatment group (Signature, Dessert, Me Time, …). Landing, booking, and admin share identical category structure.
- **Pros**: Single source of truth; admin edits propagate everywhere; matches real salon menu; no mapping layer; clearest mental model.
- **Cons**: Booking wizard shows 12 accordions (mitigated by existing search/filter).
- **Why chosen**: User confirmed; most explicit and maintainable.

### Alternative B: 12 landing categories, 6 grouped booking categories

- **Approach**: Add `bookingGroup` field or mapping layer to collapse categories for booking only.
- **Pros**: Shorter booking UI.
- **Cons**: Two catalog views; admin must understand grouping; drift risk between landing and booking.
- **Why not chosen**: Extra abstraction without business requirement; search already handles long lists.

### Alternative C: Keep 6 booking categories, landing-only metadata

- **Approach**: Static or separate landing display config decoupled from booking catalog.
- **Pros**: Minimal booking changes.
- **Cons**: Duplicate data; admin cannot edit landing menu via existing CRUD; highest drift risk.
- **Why not chosen**: Violates single-source-of-truth goal.

## Agreed Approach

**Alternative A** — extend `ServiceCategory` schema, replace seed with full PDF menu, port Astro `LandingPriceList` UI to Next.js with **server-side catalog fetch**, update booking/admin/i18n to align. Lucide React icons replace custom Astro SVGs. Filter tabs derive from category `slug` (same mapping as Astro).

## Key Decisions

1. **Schema additions on `ServiceCategory`**: `slug` (unique), `subtitle`, `description`, `note`, `featured` (boolean, default false). All optional except `slug` for seeded categories.
2. **Icons**: Lucide PascalCase names stored in existing `icon` field; mapped via `resolveLucideIconWithFallback`.
3. **Landing data loading**: Server Component (`page.tsx` or thin server wrapper) calls a server-only catalog helper (`service-catalog.server.ts`); passes serialized DTOs to client `LandingPriceList`. No client-side fetch on landing for initial render (SEO + consistency).
4. **Seed file**: Extract menu to `scripts/data/salon-menu.mjs`; seed upserts by `slug` (categories) and `(categorySlug, name)` (services). Remove obsolete placeholder categories/services not in the new menu. Estimate `estimatedMinutes` where PDF omits duration.
5. **Replace `LandingPricing`**: Remove static 5-row i18n pricing; new `LandingPriceList` section uses live catalog. Keep i18n for section chrome (eyebrow, title, filter labels, CTA) only — service names/prices come from API.
6. **Booking `CAT_META`**: Replace hardcoded 6-slug map with dynamic category icon from DTO; remove slug-specific gradient map or derive generically.
7. **Sample bookings in seed**: Update to reference real seeded service names (e.g. Signature Manicure, MicroZone Treatment).

## Open Questions

- None blocking — user chose Approach A. Filter group labels remain i18n keys; mapping logic lives in landing component (same as Astro).
