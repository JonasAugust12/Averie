# salon-marketing Specification

## Purpose

Public marketing surfaces for the Averie salon brand, including the landing page at `/` with Figma-derived layout, localized copy, and navigation to booking.

## Requirements

### Requirement: Public marketing landing

The system SHALL provide a public landing page at `/` that presents the Averie salon brand, primary Book CTA, and marketing sections derived from the **Figma landing frame** (`jSdpkpektLCG50Gr4xe2vU`, node `13:576`) within the Averie AppShell (max-width 1280px) and Averie theme tokens.

The landing page MUST include, in order, the following section groups matching the Figma design intent: header navigation, hero, **optional promotion section (when visible per salon-promotion rules)**, philosophy, curated services (three cards), **service menu and price list (API-driven)**, nail products showcase, client testimonials, working hours with appointment call-to-action, and footer with menu, services, social links, and legal links.

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

### Requirement: API-driven landing price list

The landing page SHALL render a **Price List** section (`LandingPriceList`) that displays all visible service categories and their services from the salon catalog, fetched **server-side** on initial page load (RSC or server helper — not client-only fetch for first paint).

The section MUST support category filter tabs (All, Hands & Feet, Gel & Dip, Enhancements, Facials & Waxing, Add-ons) using the same grouping rules as the Astro reference implementation, derived from category `slug`.

Each category card MUST display: Lucide icon (from category `icon`), title (`name`), optional `subtitle`, optional `description`, priced service items (`name`, formatted `price`, optional `description`), and optional category `note` footer.

A category with `featured: true` MUST display a "Popular" badge.

Section chrome (eyebrow, title, intro, filter labels, book CTA) MUST resolve from next-intl keys in `messages/{locale}/salon.json` under `landing.priceList.*`. Service names, descriptions, and prices MUST come from the catalog DTO — not static i18n rows.

The section MUST include a bottom booking call-to-action linking to `/book`.

#### Scenario: Price list renders from server catalog

- **WHEN** a visitor opens `/` without JavaScript
- **THEN** the price list section MUST render category and service data present in the server-fetched catalog payload

#### Scenario: Filter tabs reduce visible categories

- **WHEN** a visitor selects a filter tab other than "All"
- **THEN** only categories belonging to that filter group MUST be visible
- **AND** the active tab MUST update `aria-selected` for accessibility

#### Scenario: Featured category badge

- **WHEN** a category has `featured: true` in the catalog
- **THEN** its card MUST display a visible "Popular" badge

#### Scenario: Price list uses Lucide icons

- **WHEN** a category card renders its icon
- **THEN** it MUST use the Lucide React component resolved from the category `icon` field
- **AND** MUST NOT use custom inline SVG icon components

### Requirement: Landing pricing section replaces static summary

The static `LandingPricing` component with five hardcoded i18n price rows MUST be superseded by `LandingPriceList`. Obsolete `landing.pricing.rows.*` message keys MAY be removed when no component references them.

#### Scenario: Landing page view mounts price list

- **WHEN** `LandingPageView` renders on `/`
- **THEN** it MUST include `LandingPriceList` after curated services and before testimonials (or products, matching agreed section order)
- **AND** MUST NOT import the legacy static `LandingPricing` component

### Requirement: Promotion contextual copy i18n

Static contextual lines in the Promotion section (e.g. visit-salon and book-experience messages) MUST be defined in next-intl message catalogs for both `en` and `vi`. Admin-configurable fields MUST be limited to title and description.

#### Scenario: Locale renders contextual lines

- **WHEN** the Promotion section renders in `en` or `vi`
- **THEN** contextual helper lines MUST resolve from i18n keys in `messages/{locale}/salon.json`
- **AND** MUST NOT be hardcoded in the component

### Requirement: Marketing navigation

The public shell SHALL expose navigation to booking and major marketing sections (in-page anchors or routes as defined by the Figma header and footer).

The header MUST include logo, primary navigation links, language switcher, and a Book action consistent with the Figma landing header.

#### Scenario: Book CTA from header

- **WHEN** a visitor activates the primary Book control in the public header
- **THEN** the app SHALL navigate to the booking experience (`/book`)

#### Scenario: In-page section navigation

- **WHEN** a visitor activates a header or footer link that targets a landing section
- **THEN** the page SHALL scroll or navigate to the corresponding section anchor

### Requirement: Localized marketing copy

All visitor-facing marketing strings on the landing page SHALL be provided via next-intl with English as the default locale and **complete** Vietnamese messages for every landing string key.

No user-visible landing copy MAY be hardcoded in components without a message catalog entry in both `en` and `vi`.

#### Scenario: Locale messages exist

- **WHEN** the landing page renders in `en` or `vi`
- **THEN** user-visible marketing copy MUST come from message catalogs (not hardcoded locale-only strings in components)

#### Scenario: New Figma sections localized

- **WHEN** treatments/prices, nail products, working hours, or footer blocks render
- **THEN** every label, heading, body paragraph, button, and legal line MUST resolve from i18n keys present in both English and Vietnamese catalogs

### Requirement: Figma-sourced landing assets

Landing imagery and icons that appear in the Figma design MUST be exported from Figma (via MCP or equivalent export workflow), stored under the repository `public/` tree, and referenced by stable application paths in components.

Components MUST NOT depend on expiring Figma MCP temporary asset URLs in committed code.

#### Scenario: Hero and section images load from repo

- **WHEN** the landing page loads in production
- **THEN** hero, service, product, and decorative images SHALL resolve from committed static assets under `public/salon/` (or a documented subpath)

### Requirement: Landing component modularity

The landing page implementation MUST compose discrete section components (one per major Figma section group) under `@components/marketing/landing/`.

Obsolete marketing section components superseded by this redesign MUST be removed from the codebase when no longer imported.

#### Scenario: Section component ownership

- **WHEN** a developer opens the landing implementation
- **THEN** each major section (header, hero, philosophy, services, pricing, products, testimonials, hours/CTA, footer) SHALL map to its own component file in `marketing/landing/`

#### Scenario: Legacy cleanup

- **WHEN** the Figma landing refactor is complete
- **THEN** unused prior landing components (e.g. brand moment, separate booking CTA block, legacy contact block if merged) MUST NOT remain imported by `HomePageView`, `LandingPageView`, or `(user)/page.tsx`

### Requirement: Landing motion enhancement

The landing page SHALL apply subtle motion (enter transitions, hover feedback) that enhances the Figma-static layout without altering content order or copy.

Motion MUST degrade gracefully when the user prefers reduced motion.

#### Scenario: Reduced motion preference

- **WHEN** the visitor has `prefers-reduced-motion: reduce` enabled
- **THEN** non-essential entrance animations SHALL be disabled or minimized while content remains fully visible and accessible
