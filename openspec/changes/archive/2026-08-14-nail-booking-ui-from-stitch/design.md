## Context

Averie is a Next.js App Router app with established AppShell (≤1280), warm-neutral theme, next-intl, and backend rules that defer Mongo/API for this pass. Stitch project `10694160950357827758` (“Avere Luxury Salon Digital Experience”) provides 19 UI screens + 5 media assets for a luxury salon marketing site, booking wizard, and admin console.

## Goals / Non-Goals

**Goals:**

- Port every Stitch UI screen into Averie React/Tailwind components and App Router routes.
- Mock-backed UX for booking + admin management flows.
- i18n EN default + VI; Averie tokens + AppShell; clear feature/component folders.

**Non-Goals:**

- Real booking API, Mongo persistence, Auth.js salon authorization.
- Pixel-perfect Stitch CSS dumps / abandoning AppShell width.

## Decisions

1. **Mock modules + optional Query hooks** over stub Route Handlers — keeps phase UI-only and avoids fake BE surface area.
2. **Single `/book` wizard with step state** — maps all seven Stitch booking steps without route sprawl; confirmation stays `/book/confirmation`.
3. **Admin under `/admin/*` with dedicated sidebar shell** — separates marketing chrome from ops UI.
4. **Averie tokens win color conflicts** — Stitch informs structure, spacing, and hierarchy.
5. **Component layering** — thin pages; `@components/{marketing,booking,admin,ui}`; `@validations` for forms; `@services` wraps mocks.

## Risks / Trade-offs

- [Large surface (19 screens)] → Clustered tasks (`shell` / `catalog` / `book` / `account` / `misc`); review after each cluster.
- [Stitch 2560 desktop vs 1280 shell] → Constrain to AppShell; responsive stacks for mobile booking.
- [Mock auth feels “real”] → Label mock gates; no security claims in UI copy.

## Migration Plan

- Additive routes/components only; existing todo/health demos may remain until intentionally removed later.
- Rollback: delete new route trees + mocks; no DB migrations.

## Open Questions

- Booking step persistence (Zustand vs URL query) — default URL `?step=` for shareability during UI QA.
- Whether to keep demo todo page linked from anywhere — default leave unlinked from salon nav.
