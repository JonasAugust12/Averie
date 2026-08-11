## ADDED Requirements

### Requirement: Public marketing landing

The system SHALL provide a public landing page at `/` that presents the Avere salon brand, primary Book CTA, and marketing sections derived from the Stitch landing screen layout within the Averie AppShell (max-width 1280px) and Averie theme tokens.

#### Scenario: Visitor opens home

- **WHEN** a visitor navigates to `/`
- **THEN** the page SHALL render branding, navigation, at least one Book CTA, and key marketing sections without requiring authentication

### Requirement: Marketing navigation

The public shell SHALL expose navigation to booking and major marketing sections (in-page anchors are acceptable when dedicated Stitch pages do not exist).

#### Scenario: Book CTA from header

- **WHEN** a visitor activates the primary Book control in the public header
- **THEN** the app SHALL navigate to the booking experience

### Requirement: Localized marketing copy

All new visitor-facing marketing strings SHALL be provided via next-intl with English as the default locale and Vietnamese messages available.

#### Scenario: Locale messages exist

- **WHEN** the landing page renders in `en` or `vi`
- **THEN** user-visible marketing copy MUST come from message catalogs (not hardcoded locale-only strings in components)
