## MODIFIED Requirements

### Requirement: Public marketing landing

The system SHALL provide a public landing page at `/` that presents the Averie salon brand, primary Book CTA, and marketing sections derived from the **Figma landing frame** (`jSdpkpektLCG50Gr4xe2vU`, node `13:576`) within the Averie AppShell (max-width 1280px) and Averie theme tokens.

The landing page MUST include, in order, the following section groups matching the Figma design intent: header navigation, hero, **optional promotion section (when visible per salon-promotion rules)**, philosophy, curated services (three cards), treatments and prices, nail products showcase, client testimonials, working hours with appointment call-to-action, and footer with menu, services, social links, and legal links.

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

#### Scenario: Promotion section after hero when visible

- **WHEN** promotion settings are visible per `isPromotionVisible` and `imageUrl` is present
- **THEN** the landing page MUST render the Promotion section immediately after Hero and before Philosophy
- **AND** the section MUST use Editorial Spotlight layout with flexible image containment (`object-contain`) for arbitrary aspect ratios

#### Scenario: Promotion hidden when not configured

- **WHEN** promotion is not visible OR `imageUrl` is missing
- **THEN** the Promotion section MUST NOT render and section order MUST proceed from Hero to Philosophy

---

## ADDED Requirements

### Requirement: Promotion contextual copy i18n

Static contextual lines in the Promotion section (e.g. visit-salon and book-experience messages) MUST be defined in next-intl message catalogs for both `en` and `vi`. Admin-configurable fields MUST be limited to title and description.

#### Scenario: Locale renders contextual lines

- **WHEN** the Promotion section renders in `en` or `vi`
- **THEN** contextual helper lines MUST resolve from i18n keys in `messages/{locale}/salon.json`
- **AND** MUST NOT be hardcoded in the component
