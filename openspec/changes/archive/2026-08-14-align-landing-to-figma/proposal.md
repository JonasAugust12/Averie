## Why

The public landing page was previously aligned to Stitch HTML, but the designer has shipped a revised **Figma** landing with new sections (Treatments & Prices, Nail Products) and updated header, hero, and footer composition. Keeping the Stitch-based landing creates visual drift from the approved design and blocks marketing fidelity. A dedicated Figma-driven refactor—using MCP to read the file and export assets—ensures the salon’s first impression matches the new design while staying inside Averie’s AppShell and i18n conventions.

## What Changes

- Rebuild **`/` landing** to match Figma frame **Landing page** (`jSdpkpektLCG50Gr4xe2vU`, node `13:576`).
- Add missing sections: **Treatments & Prices**, **Our Nail Products**, **Working hours + dual CTA** per Figma.
- Replace header, hero, philosophy, services grid, testimonials, and footer layouts to match Figma hierarchy within **1280px** AppShell.
- Introduce **`@components/marketing/landing/*`** — one component per major section.
- Export Figma images/icons via MCP **`download_assets`**; commit to `public/salon/`.
- **Full EN + VI** strings in message catalogs for all landing copy.
- Apply **responsive stacking** on mobile/tablet without a separate mobile Figma artboard.
- Layer **subtle animations** on Figma-static layout (hover, fade-in; respect reduced motion).
- **Remove** obsolete marketing components no longer referenced (`BrandMoment`, `BookingCtaSection`, `ContactSection`, superseded section files).
- Document Figma refs under **`docs/figma/`**.

**Visual fidelity (landing)**

- From: Stitch-aligned marketing sections with missing Figma blocks
- To: Figma section structure, typography hierarchy, imagery, and CTAs within AppShell ≤1280
- Reason: Figma is the new approved design source for landing
- Impact: UI-only; non-breaking for routes and mock booking flows

## Capabilities

### New Capabilities

- _(none)_

### Modified Capabilities

- `salon-marketing`: Landing page requirements MUST reflect Figma landing layout (sections, navigation, CTAs, localized copy, responsive behavior) instead of Stitch landing as the design reference.

## Impact

- `src/components/marketing/**` (new `landing/` folder; deletions of legacy section files)
- `src/app/(user)/page.tsx` (composition import if renamed)
- `messages/en.json`, `messages/vi.json` (landing copy)
- `public/salon/**` (exported Figma assets)
- `docs/figma/**` (design reference manifest)
- No changes to `src/app/api/**`, `src/actions/**`, Mongo models, or auth

## Non-goals

- No booking wizard, login, or admin UI changes.
- No full-bleed 1920px layout outside AppShell 1280px.
- No pixel-perfect claim for decorative Figma offsets scaled down to 1280.
- No dedicated mobile Figma design — responsive behavior is implementation-defined.
- No backend or persistence work.
