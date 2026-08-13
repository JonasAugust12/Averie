## Context

Averie’s public landing at `/` renders `HomePageView` with marketing sections under `@components/marketing/`. A prior change aligned landing to **Stitch**; the designer has since published a new **Figma** landing (`jSdpkpektLCG50Gr4xe2vU`, node `13:576`) with additional sections (Treatments & Prices, Nail Products) and revised header/footer/hero composition. Figma MCP is connected and readable for this file.

Stack constraints unchanged: Next.js 15 App Router, Tailwind 4, next-intl (en/vi), AppShell **max-width 1280px**, theme tokens Primary `#2B2623`, Secondary `#D4C5B9`, Tertiary `#F5EFEA`, Neutral `#FDFCFB`, fonts Playfair Display + Inter.

## Goals / Non-Goals

**Goals:**

- Match Figma landing structure, hierarchy, spacing, and imagery **within 1280px** content width.
- Implement all nine section groups from the Figma frame with **one focused component each**.
- Export and commit Figma assets; wire images via stable `/public` paths.
- Provide **complete EN + VI** message catalogs for all landing copy.
- Add **subtle motion** (Framer Motion or CSS transitions) that respects reduced-motion preferences where practical.
- **Delete** obsolete marketing components and update `marketing/index.ts` exports.
- Save Figma section references under `docs/figma/` during apply (screenshot or design-context notes per section).

**Non-Goals:**

- API, Mongo, Server Actions, or auth changes.
- Booking/admin/login screen changes.
- Pixel-perfect reproduction of Figma’s 1920px decorative offsets outside 1280px.
- Separate mobile Figma artboard or new breakpoints beyond sensible Tailwind responsive stacks.
- Removing shared utilities used elsewhere (`LanguageSwitcher`, `Button`, `AppShell`).

## Decisions

1. **Figma MCP-first workflow** — For each section, call `get_design_context` on the relevant node id (discovered via `get_metadata` on `13:576`), then adapt output to Averie conventions. Export images with `download_assets`; never rely on expiring MCP asset URLs in committed code.

2. **Component folder `src/components/marketing/landing/`** — Thin orchestrator `LandingPageView.tsx` composes section components. Keeps legacy `HomePageView` as re-export or replaces it in `(user)/page.tsx` during apply.

    ```
    landing/
      LandingPageView.tsx
      LandingHeader.tsx
      LandingHero.tsx
      LandingPhilosophy.tsx
      LandingServices.tsx
      LandingPricing.tsx
      LandingProducts.tsx
      LandingTestimonials.tsx
      LandingHoursCta.tsx
      LandingFooter.tsx
      index.ts
    ```

3. **1280px constraint** — All sections render inside existing `AppShell`; use internal grids instead of `-mx` full-bleed breakouts unless a subsection needs a subtle background band still padded to shell edges.

4. **Responsive** — Desktop-first from Figma; below `md`/`lg`, stack multi-column layouts (hero, philosophy, service cards, product grid, testimonials, hours/CTA). Decorative offset images may hide or simplify on small screens.

5. **Animation policy** — Static Figma composition is the layout source; add:
    - Section enter: `motion` fade/slide with `prefers-reduced-motion` fallback
    - Interactive: button/link hover consistent with existing marketing patterns
    - Do **not** reintroduce heavy hero text effects if they conflict with Figma typography hierarchy

6. **i18n** — Extend `messages/en.json` and `messages/vi.json` (salon namespace used by `useSalonTranslations`). Keys grouped by section: `landing.header`, `landing.hero`, `landing.philosophy`, etc.

7. **Legacy cleanup** — After parity pass, delete unused files: `BrandMoment`, `BookingCtaSection`, `ContactSection`, and old section files if fully superseded. Run grep to ensure zero imports before deletion.

8. **Stitch docs** — Do not modify Stitch HTML refs; add parallel `docs/figma/landing.md` with file key, node ids, and export manifest.

## Risks / Trade-offs

| Risk                               | Mitigation                                                                       |
| ---------------------------------- | -------------------------------------------------------------------------------- |
| Figma 1920 artboard vs 1280 shell  | Scale spacing proportionally; prioritize hierarchy over absolute pixel positions |
| Large image count                  | Batch `download_assets`; compress if needed; name files predictably              |
| MCP rate limits                    | Read metadata once; cache section node ids in `docs/figma/`                      |
| i18n drift from Figma English copy | Use Figma text as EN source; professional VI translation in same pass            |
| Deleting components still imported | Grep + type-check before removal; update barrel exports                          |

## Migration Plan

- Replace `HomePageView` composition with new landing sections (same route `/`, metadata unchanged unless copy updates needed).
- Add assets under `public/salon/` (subfolder `figma/` optional).
- Remove dead marketing components in final cleanup task.
- Rollback: revert marketing folder + messages + public assets; no database impact.

## Open Questions

- Exact Figma child node ids per section — resolved during apply via `get_metadata` on `13:576`.
- Nav items: align Figma labels with existing anchor ids (`#services`, etc.) or update anchors in header/footer together.
