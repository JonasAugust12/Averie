## Design Summary

Refactor the public landing page at `/` to match the new Figma design (**Averie** file `jSdpkpektLCG50Gr4xe2vU`, frame **Landing page** `13:576`). The current landing was aligned to Stitch; the designer’s Figma revision is now the visual source of truth. Implementation uses Figma MCP (`get_design_context`, `download_assets`) per section, keeps all content inside **AppShell max-width 1280px**, adds **responsive stacking** without a separate mobile Figma artboard, layers **subtle motion** on top of the static Figma layout, splits landing into **focused section components**, **removes obsolete marketing components**, and provides **full EN + VI** copy via next-intl.

## Alternatives Considered

### Alternative A: Incremental patch on existing Stitch-aligned components

- **Approach**: Tweak `HeroSection`, `ServicesPreview`, etc. in place without new sections or deletions.
- **Pros**: Smaller diff; faster initial pass.
- **Cons**: Figma adds **Treatments & Prices** and **Our Nail Products** sections absent from current code; legacy decorative patterns (`BrandMoment`, split contact/CTA blocks) fight the new layout.
- **Why not chosen**: Structural mismatch — patching yields hybrid UI that matches neither Stitch nor Figma.

### Alternative B: Full-bleed 1920px layout (break out of AppShell)

- **Approach**: Match Figma artboard width with full-width sections and decorative offsets.
- **Pros**: Closer desktop pixel parity with Figma file.
- **Cons**: Conflicts with Averie global constraint (AppShell ≤1280); inconsistent with booking/admin; harder responsive behavior.
- **Why not chosen**: Owner explicitly wants content **within 1280px**.

### Alternative C: Section-by-section Figma fidelity rebuild (chosen)

- **Approach**: Read each Figma section via MCP, export assets, build new `@components/marketing/landing/*` sections, delete unused legacy marketing components, i18n all strings.
- **Pros**: Clear ownership per section; matches new design; clean component tree; aligns with prior Stitch method but new source.
- **Cons**: Larger one-time refactor; depends on Figma MCP access and asset export.
- **Why chosen**: Best balance of fidelity, maintainability, and project conventions.

## Agreed Approach

**Alternative C** — rebuild landing from Figma section references inside AppShell 1280px, with pragmatic responsive behavior and enhanced (not replaced) motion.

## Key Decisions

| Decision      | Choice                                                                                                                              |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Design source | Figma `13:576` (replaces Stitch as landing truth)                                                                                   |
| Layout width  | Content stays within AppShell **max 1280px** — no full-bleed breakout                                                               |
| Mobile        | **Responsive flex/grid stacks** — no dedicated mobile Figma required                                                                |
| Animation     | **Figma layout + subtle motion** (fade-in, hover, optional scroll reveal) — not heavy SplitText hero unless it fits Figma hierarchy |
| Components    | **One component per major section** under `marketing/landing/`; remove superseded files                                             |
| i18n          | **All user-visible strings** in `messages` EN + VI — no hardcoded locale text                                                       |
| Assets        | Export via Figma MCP `download_assets` → commit under `public/salon/` (or `public/salon/figma/`)                                    |
| Backend       | **UI-only** — no API/DB/auth changes                                                                                                |

**Figma sections to implement (top → bottom):**

1. Header — logo, nav, Book, language switcher
2. Hero — eyebrow, title, body, CTA, hero image
3. Philosophy — images + “Elevating the standard…”
4. Curated services — 3 service cards
5. Treatments & prices — service list + price column + decorative imagery
6. Nail products — product grid with labels
7. Testimonials — 3 review cards
8. Working hours + appointment CTA — hours block + dual buttons
9. Footer — Menu, Service, Social, legal links

**Legacy components likely removed after migration:**

- `BrandMoment.tsx`, `BookingCtaSection.tsx`, `ContactSection.tsx` (merged/replaced by Figma sections)
- Superseded section implementations if fully replaced (`HeroSection`, `PhilosophySection`, etc.) — delete only when no imports remain

## Open Questions

- Final nav anchor keys vs Figma labels (About, Menu, Blog, Contact) — map to i18n during apply.
- Whether any `/salon/*.jpg` assets can be reused vs full Figma re-export — default: export from Figma where design differs.
