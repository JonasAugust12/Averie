# Align Landing to Figma — Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Rebuild the public landing page at `/` to match Figma frame `13:576` within AppShell 1280px, with full EN/VI i18n, exported assets, modular section components, subtle motion, and removal of obsolete marketing files.

**Architecture:** Figma MCP reads design context per section → adapt to React 19 + Tailwind 4 client components under `@components/marketing/landing/`. Page route stays `(user)/page.tsx`. All copy via `useSalonTranslations` / next-intl. No backend changes.

**Tech Stack:** Next.js 15 App Router, Tailwind 4, Framer Motion (optional), next-intl, Figma MCP (`get_design_context`, `download_assets`, `get_metadata`).

**Design refs:** `openspec/changes/align-landing-to-figma/design.md`, Figma file `jSdpkpektLCG50Gr4xe2vU`, node `13:576`.

---

## Task 1: Figma discovery + docs

- [ ] **Step 1:** Run `get_metadata` with `fileKey=jSdpkpektLCG50Gr4xe2vU`, `nodeId=13:576`; paste XML into scratch buffer.
- [ ] **Step 2:** Create `docs/figma/landing.md` with file URL, frame id, and table: Section name → Figma node id → planned component file.
- [ ] **Step 3:** For Hero (`13:837` area / parent frame), run `get_design_context` once to validate MCP access; note token hints in doc (no secrets).

---

## Task 2: Asset export batch

- [ ] **Step 1:** Identify image-heavy nodes from metadata (hero, philosophy images, service cards, product grid, testimonials avatars if any).
- [ ] **Step 2:** Call `download_assets` per node; save bytes to `public/salon/figma/` with kebab names (e.g. `hero-main.webp`, `philosophy-1.jpg`).
- [ ] **Step 3:** Append asset manifest to `docs/figma/landing.md` (filename → Figma node → used in component).

---

## Task 3: i18n keys (EN)

- [ ] **Step 1:** Open `messages/en.json`; add nested `landing` object mirroring sections: `header`, `hero`, `philosophy`, `services`, `pricing`, `products`, `testimonials`, `hours`, `footer`, `legal`.
- [ ] **Step 2:** Copy text from Figma/`get_design_context` into EN values; use arrays for nav items and price rows where helpful.
- [ ] **Step 3:** Run app briefly — no runtime yet; verify JSON valid.

---

## Task 4: i18n keys (VI)

- [ ] **Step 1:** Mirror every `landing.*` key in `messages/vi.json` with Vietnamese translations.
- [ ] **Step 2:** Grep `landing.` in en vs vi — counts must match.

---

## Task 5: Scaffold landing folder

- [ ] **Step 1:** Create `src/components/marketing/landing/index.ts` exporting all section components + `LandingPageView`.
- [ ] **Step 2:** Create stub `LandingPageView.tsx` composing placeholders in Figma order inside `<AppShell>`.
- [ ] **Step 3:** Update `src/app/(user)/page.tsx` to import `LandingPageView` from `@components/marketing/landing`.

---

## Task 6: LandingHeader

- [ ] **Step 1:** `get_design_context` on header node from docs map.
- [ ] **Step 2:** Implement `LandingHeader.tsx` — logo img, nav links from i18n, reuse `LanguageSwitcher`, Book → `/book`.
- [ ] **Step 3:** Sticky header + mobile menu pattern (reuse patterns from old `SiteHeader` if useful).

---

## Task 7: LandingHero

- [ ] **Step 1:** Implement layout from Figma context — eyebrow, h1, body, CTA, hero image from `public/salon/figma/`.
- [ ] **Step 2:** Grid: text column + image column; stack on mobile.
- [ ] **Step 3:** Add fade-in motion; wrap with `useReducedMotion` or CSS media query.

---

## Task 8: LandingPhilosophy + LandingServices

- [ ] **Step 1:** Implement `LandingPhilosophy.tsx` (images + copy + secondary CTA).
- [ ] **Step 2:** Implement `LandingServices.tsx` — three cards with image, title, description, Book link.
- [ ] **Step 3:** Assign section ids for anchors (`#philosophy`, `#services`).

---

## Task 9: LandingPricing + LandingProducts (new sections)

- [ ] **Step 1:** Implement `LandingPricing.tsx` — service list + prices from i18n arrays.
- [ ] **Step 2:** Implement `LandingProducts.tsx` — responsive product grid with overlay labels.
- [ ] **Step 3:** Visual pass vs Figma screenshot at 1280px max container.

---

## Task 10: LandingTestimonials + LandingHoursCta + LandingFooter

- [ ] **Step 1:** Implement `LandingTestimonials.tsx` — three cards, stars, quote, author initials avatar.
- [ ] **Step 2:** Implement `LandingHoursCta.tsx` — hours table + dual CTAs (Book + secondary).
- [ ] **Step 3:** Implement `LandingFooter.tsx` — columns Menu/Service/Social + bottom bar legal links.

---

## Task 11: Responsive + motion polish

- [ ] **Step 1:** Test 375px / 768px / 1280px in browser; fix overflow and image aspect ratios.
- [ ] **Step 2:** Unify hover states on buttons/cards; disable heavy motion when `prefers-reduced-motion`.

---

## Task 12: Legacy cleanup

- [ ] **Step 1:** `rg "BrandMoment|BookingCtaSection|ContactSection|HomePageView|HeroSection"` — list imports.
- [ ] **Step 2:** Delete unused files; update `marketing/index.ts`.
- [ ] **Step 3:** Remove dead exports; ensure no broken imports.

---

## Task 13: Verification

- [ ] **Step 1:** `pnpm type-check`
- [ ] **Step 2:** `pnpm lint`
- [ ] **Step 3:** Manual EN/VI toggle on `/`; click all CTAs and anchors.
- [ ] **Step 4:** Side-by-side Figma screenshot vs localhost at desktop width.

**Commit suggestion:** `feat(marketing): align landing page to Figma design`
