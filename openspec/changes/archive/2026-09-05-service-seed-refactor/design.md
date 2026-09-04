## Context

The Next.js app has a MongoDB-backed service catalog (`ServiceCategory` + `Service`) exposed via `GET /api/service-categories`. The seed script currently inserts **6 placeholder categories and 4 sample services**. The Astro marketing site has a rich **12-category price list** in static `price-list.ts` with subtitles, descriptions, notes, and ~55 priced items from the salon PDF.

The Next.js landing page has `LandingPricing` (static i18n, 5 summary rows) which is **not mounted** in `LandingPageView`. Booking and admin already consume the live API but reflect the incomplete seed data.

**Constraints**: GET reads via Route Handlers; mutations via Server Actions; `{ status, message, data }` envelope; next-intl for UI chrome; Lucide icons already used in admin.

## Goals / Non-Goals

**Goals:**

- Single catalog: 12 categories, full PDF menu, shared by landing, booking, admin
- Extend `ServiceCategory` with marketing fields for landing parity
- Server-fetched catalog on landing (RSC → client component)
- Full seed in `scripts/data/salon-menu.mjs` + idempotent re-seed
- Update booking, admin forms, messages, and affected dashboards
- Lucide icons only (no custom SVG icon component)

**Non-Goals:**

- Astro site changes (reference only)
- Admin drag-and-drop category reorder UI (sortOrder via seed/form is enough)
- Price history or multi-currency
- Automatic PDF import pipeline
- Booking category grouping layer (Approach B rejected)

## Decisions

### 1. Category schema extension

Add to `ServiceCategory`:

| Field         | Type                              | Purpose                              |
| ------------- | --------------------------------- | ------------------------------------ |
| `slug`        | string, unique, required for seed | Stable id for filters, URLs, upsert  |
| `subtitle`    | string, optional                  | e.g. "Refreshing · Revitalizing"     |
| `description` | string, optional                  | Category overview paragraph          |
| `note`        | string, optional                  | Footnote (Builder shape-change note) |
| `featured`    | boolean, default false            | "Popular" badge (Signature)          |

**Rationale**: Keeps marketing metadata on the entity admin already manages. Filter groups (`hands-feet`, `gel-dip`, etc.) derived from `slug` in UI — same function as Astro `getFilterGroup()`, no extra DB field.

### 2. Server-side landing fetch

```
page.tsx (RSC)
  └─ getPublicServiceCatalog()  [src/server/service-catalog.server.ts]
       └─ ServiceCategory.find().sort({ sortOrder })
       └─ Service.find({ visible: true })
  └─ <LandingPageView catalog={data} />
       └─ <LandingPriceList initialCategories={data} />  (client: filters only)
```

**Rationale**: User requested server API fetch; direct DB read in RSC avoids HTTP loopback and matches Next.js 15 patterns. TanStack Query remains for booking/admin client paths.

**Alternative rejected**: Client-only `useServiceCategories()` on landing — worse SEO, loading flash.

### 3. Seed strategy

- **Source of truth**: `scripts/data/salon-menu.mjs` — 12 categories + all services from PDF/Astro, with estimated minutes.
- **Upsert keys**: category by `slug`; service by `{ categorySlug, name }`.
- **Cleanup**: After upsert, delete categories whose `slug` is not in the menu file (and cascade-delete their services). Prevents orphan placeholder data.
- **Bookings**: Update sample booking references to valid seeded service names.

**Duration estimates** (when PDF silent): Manicure 45m, Pedicure 60–75m, Express 20–30m, Gel 50–60m, Wax 15–45m by area, Acrylic/Dip/Builder 90–120m, Facials per PDF (10/30/60 min).

### 4. Landing UI

Port Astro `LandingPriceList` layout to React:

- Filter tab bar (client state)
- Category cards with Lucide icon, subtitle, description, item list, note footer
- Featured badge when `featured: true`
- Book CTA banner at bottom
- Section chrome from `messages/{locale}/salon.json` (`landing.priceList.*`)

Remove or stop exporting `LandingPricing`; remove obsolete `landing.pricing.rows.*` i18n keys after migration.

### 5. Booking & admin alignment

- **Booking `ServiceStep`**: Remove hardcoded `CAT_META` slug keys; use category `icon` from DTO. Category accordion lists all 12 groups.
- **Admin `CategoryFormModal`**: Add fields for slug (immutable after create), subtitle, description, note, featured toggle.
- **Validations/OpenAPI/mappers**: Mirror new fields end-to-end.

### 6. Lucide icon mapping (seed defaults)

| Slug        | Lucide icon |
| ----------- | ----------- |
| signature   | Sparkles    |
| dessert     | CupSoda     |
| me-time     | Leaf        |
| gentlemen   | UserRound   |
| little-diva | Baby        |
| gel-polish  | Palette     |
| add-ons     | Plus        |
| waxing      | Feather     |
| acrylic     | PenLine     |
| dip         | Layers      |
| builder     | Gem         |
| facials     | ScanFace    |

## Risks / Trade-offs

| Risk                                                      | Mitigation                                                                   |
| --------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Seed cleanup deletes admin-customized categories          | Document that re-seed resets catalog; only run on dev/staging or with backup |
| 12 booking categories feels long                          | Existing search + category filter; optional future UX polish out of scope    |
| Breaking existing booking references to old service names | Seed updates sample bookings; prod DB needs manual migration note in tasks   |
| `slug` uniqueness conflicts on admin create               | Validate slug format; auto-generate from name if omitted on create           |

## Migration Plan

1. Deploy schema (new fields optional/default — backward compatible reads)
2. Run `pnpm db:seed` to upsert full menu and prune old categories
3. Verify landing, `/book`, `/admin/services`
4. Rollback: restore DB backup; old code ignores new fields

## Open Questions

None — Approach A approved by user.
