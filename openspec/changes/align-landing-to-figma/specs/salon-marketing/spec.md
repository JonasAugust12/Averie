## MODIFIED Requirements

### Requirement: Public marketing landing

The system SHALL provide a public landing page at `/` that presents the Averie salon brand, primary Book CTA, and marketing sections derived from the **Figma landing frame** (`jSdpkpektLCG50Gr4xe2vU`, node `13:576`) within the Averie AppShell (max-width 1280px) and Averie theme tokens.

The landing page MUST include, in order, the following section groups matching the Figma design intent: header navigation, hero, philosophy, curated services (three cards), treatments and prices, nail products showcase, client testimonials, working hours with appointment call-to-action, and footer with menu, services, social links, and legal links.

#### Scenario: Visitor opens home

- **WHEN** a visitor navigates to `/`
- **THEN** the page SHALL render branding, navigation, at least one Book CTA, and all Figma-defined marketing sections without requiring authentication
- **AND** all section content SHALL remain within the AppShell max-width container (1280px)

#### Scenario: Desktop layout matches Figma structure

- **WHEN** the landing page renders at viewport width ≥ 1024px
- **THEN** multi-column Figma sections (hero, philosophy, services, products, testimonials) SHALL use grid or flex layouts that reflect the Figma hierarchy and reading order

#### Scenario: Mobile responsive stacking

- **WHEN** the landing page renders at viewport width &lt; 768px
- **THEN** multi-column sections SHALL stack vertically in the same content order as desktop without requiring a separate mobile Figma artboard

---

### Requirement: Marketing navigation

The public shell SHALL expose navigation to booking and major marketing sections (in-page anchors or routes as defined by the Figma header and footer).

The header MUST include logo, primary navigation links, language switcher, and a Book action consistent with the Figma landing header.

#### Scenario: Book CTA from header

- **WHEN** a visitor activates the primary Book control in the public header
- **THEN** the app SHALL navigate to the booking experience (`/book`)

#### Scenario: In-page section navigation

- **WHEN** a visitor activates a header or footer link that targets a landing section
- **THEN** the page SHALL scroll or navigate to the corresponding section anchor

---

### Requirement: Localized marketing copy

All visitor-facing marketing strings on the landing page SHALL be provided via next-intl with English as the default locale and **complete** Vietnamese messages for every landing string key.

No user-visible landing copy MAY be hardcoded in components without a message catalog entry in both `en` and `vi`.

#### Scenario: Locale messages exist

- **WHEN** the landing page renders in `en` or `vi`
- **THEN** user-visible marketing copy MUST come from message catalogs (not hardcoded locale-only strings in components)

#### Scenario: New Figma sections localized

- **WHEN** treatments/prices, nail products, working hours, or footer blocks render
- **THEN** every label, heading, body paragraph, button, and legal line MUST resolve from i18n keys present in both English and Vietnamese catalogs

---

## ADDED Requirements

### Requirement: Figma-sourced landing assets

Landing imagery and icons that appear in the Figma design MUST be exported from Figma (via MCP or equivalent export workflow), stored under the repository `public/` tree, and referenced by stable application paths in components.

Components MUST NOT depend on expiring Figma MCP temporary asset URLs in committed code.

#### Scenario: Hero and section images load from repo

- **WHEN** the landing page loads in production
- **THEN** hero, service, product, and decorative images SHALL resolve from committed static assets under `public/salon/` (or a documented subpath)

---

### Requirement: Landing component modularity

The landing page implementation MUST compose discrete section components (one per major Figma section group) under `@components/marketing/landing/`.

Obsolete marketing section components superseded by this redesign MUST be removed from the codebase when no longer imported.

#### Scenario: Section component ownership

- **WHEN** a developer opens the landing implementation
- **THEN** each major section (header, hero, philosophy, services, pricing, products, testimonials, hours/CTA, footer) SHALL map to its own component file in `marketing/landing/`

#### Scenario: Legacy cleanup

- **WHEN** the Figma landing refactor is complete
- **THEN** unused prior landing components (e.g. brand moment, separate booking CTA block, legacy contact block if merged) MUST NOT remain imported by `HomePageView`, `LandingPageView`, or `(user)/page.tsx`

---

### Requirement: Landing motion enhancement

The landing page SHALL apply subtle motion (enter transitions, hover feedback) that enhances the Figma-static layout without altering content order or copy.

Motion MUST degrade gracefully when the user prefers reduced motion.

#### Scenario: Reduced motion preference

- **WHEN** the visitor has `prefers-reduced-motion: reduce` enabled
- **THEN** non-essential entrance animations SHALL be disabled or minimized while content remains fully visible and accessible

---

## REMOVED Requirements

### Requirement: Stitch-derived landing layout as design source

**Reason**: Landing design authority moved from Stitch HTML to the designer’s Figma file; Stitch remains relevant for other screens but not as the landing layout reference.

**Migration**: Implementers MUST use Figma MCP (`get_design_context`, `download_assets`) and `docs/figma/` references instead of `docs/stitch/` for landing layout decisions.
