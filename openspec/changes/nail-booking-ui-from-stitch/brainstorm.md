## Design Summary

Port the full **Avere Luxury Salon Digital Experience** Stitch project (`10694160950357827758`) into Averie as a **UI-only** Next.js surface: marketing landing, multi-step client booking wizard, client/admin login shells, and admin salon-management screens. Use Averie AppShell (≤1280px) + Averie theme tokens; Stitch supplies layout/hierarchy only (not pixel-perfect). Data is mock/hardcoded. Structure components and client services in the spirit of BRIX / bkb-storage-ticket-app while obeying `docs/overview.md` aliases and layering.

**Stitch inventory (2026-08-12):** 24 project items — **19 UI screens** + **5 image/asset entries** (not routes).

### Screen → route → cluster

| Screen (Stitch title)                    | screenId (short)         | Suggested Averie route           | Cluster               |
| ---------------------------------------- | ------------------------ | -------------------------------- | --------------------- |
| Luxury Nail Salon Landing Page           | `7af10a90…`              | `/`                              | catalog (+ shell nav) |
| Book Appointment - Select Service        | `22c574d8…`              | `/book` (step 1)                 | book                  |
| Book Appointment - Select Employee       | `8f188e98…`              | `/book` (step 2)                 | book                  |
| Book Appointment - Select Date           | `d167d5a1…`              | `/book` (step 3)                 | book                  |
| Book Appointment - Select Time           | `9721ec9c…`              | `/book` (step 4)                 | book                  |
| Book Appointment - Customer Information  | `009dfed0…`              | `/book` (step 5)                 | book                  |
| Book Appointment - Review Details        | `33644b00…`              | `/book` (step 6)                 | book                  |
| Book Appointment - Confirmation          | `571b290e…`              | `/book/confirmation`             | book                  |
| Client Login                             | `088ee3a2…`              | `/login`                         | account               |
| Admin Login                              | `ec232374…`              | `/admin/login`                   | account               |
| Admin Dashboard - Overview               | `c3a73983…`              | `/admin`                         | misc (admin)          |
| Admin Dashboard - Bookings List          | `2f98dae2…`              | `/admin/bookings`                | misc                  |
| Admin Dashboard - Booking Details        | `3477e208…`              | `/admin/bookings/[id]`           | misc                  |
| Admin Dashboard - Service Management     | `7ef3bdd0…`              | `/admin/services`                | misc                  |
| Admin Dashboard - Staff Management       | `7c31d6e6…`              | `/admin/staff`                   | misc                  |
| Admin Dashboard - Staff Schedule Details | `8ec146a0…`              | `/admin/staff/[id]/schedule`     | misc                  |
| Admin Dashboard - Master Schedule        | `aff129a7…`              | `/admin/schedule`                | misc                  |
| Admin Dashboard - Shift Management       | `09ef2e32…`              | `/admin/shifts`                  | misc                  |
| Admin Dashboard - Schedule Settings      | `76bee727…`              | `/admin/settings/schedule`       | misc                  |
| image.png / editorial assets (×5)        | `65024144…`, `ea94854a…` | _(no route — static/mock media)_ | misc (assets)         |

**Shell:** shared public `SiteHeader` / `SiteFooter` (landing) and booking wizard chrome; admin `AdminSidebar` shell under `/admin/*`.

## Alternatives Considered

### Alternative A: Full UI port + mock modules (chosen direction)

- **Approach**: Implement all 19 UI screens with local mock data; port layout from Stitch into React/Tailwind components; keep Averie tokens + AppShell.
- **Pros**: Matches “làm hết screen”; demoable end-to-end; clear OpenSpec scope; no BE risk.
- **Cons**: Large UI surface; admin+booking in one change needs task clustering.
- **Why not chosen**: N/A — this is the agreed path.

### Alternative B: Booking MVP only, admin later

- **Approach**: Ship landing + `/book` wizard first; defer admin screens.
- **Pros**: Faster first review; smaller PR risk.
- **Cons**: Contradicts explore lock (“all screens”); splits Stitch fidelity.
- **Why not chosen**: User explicitly chose full Stitch coverage.

### Alternative C: Pixel-perfect Stitch + stub API envelope

- **Approach**: Match Stitch CSS 1:1; add fake GET Route Handlers early.
- **Pros**: Closest to design tool; early BE shape practice.
- **Cons**: Breaks Averie AppShell/theme; expands scope beyond UI-mock; more files/noise.
- **Why not chosen**: Explore locked Averie tokens + no API/Mongo.

## Agreed Approach

**Alternative A**, refined:

1. **Clusters for delivery:** `shell` → `catalog` → `book` → `account` → `misc` (admin + assets).
2. **Booking as one wizard route** (`/book`) with step state (URL query or local store) rather than 7 separate top-level routes — still implement every Stitch step UI.
3. **Mock layer:** `@/mocks` (or `src/mocks`) + thin `@services` hooks returning promises/fake data (TanStack Query optional where list/detail UX benefits); **no** new booking Route Handlers / Server Actions / Mongo models in this change.
4. **Visual:** AppShell max-width 1280; Primary `#2B2623`, Secondary `#D4C5B9`, Tertiary `#F5EFEA`, Neutral `#FDFCFB`; Playfair + Inter; Lucide icons; port structure from Stitch HTML/screenshots, not paste HTML.
5. **i18n:** `next-intl` with **EN default**, VI messages for user-facing copy on all new screens.
6. **Auth screens:** UI + mock submit only (no real Auth.js login wiring for salon admin/client beyond existing demo stubs if reused cosmetically).

## Key Decisions

- Stitch projectId `10694160950357827758` is the LOOK source of truth.
- All **19 UI screens** in scope; **5 assets** used as media only.
- Admin lives under `/admin/*` with its own shell; public site keeps marketing + book + client login.
- Component boundaries: pages thin; feature folders under `@components` (e.g. `booking/`, `admin/`, `marketing/`); validators in `@validations` for forms even when mock-only.
- English default locale; Vietnamese catalogs maintained in parallel.

## Open Questions

- Exact booking step navigation (single `/book?step=` vs nested routes) — default to **single route + step state** unless apply discovers Stitch URLs that force otherwise.
- Whether marketing nav items (`SERVICE`, `GALLERY`, …) are in-page anchors on `/` or stub pages — default to **in-page sections / `#` anchors** until Stitch shows dedicated pages (none in inventory).
- Admin “gate”: UI-only redirect after mock login vs always-open — default **mock login gate with client-side flag** (not real session protection).
