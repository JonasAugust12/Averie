## 1. Figma refs + assets

- [ ] 1.1 [ui] Call Figma MCP `get_metadata` on node `13:576`; save section node-id map to `docs/figma/landing.md`
- [ ] 1.2 [ui] Per major section, capture design context notes or screenshots under `docs/figma/` for apply reference
- [ ] 1.3 [ui] Export landing images/icons via `download_assets`; commit to `public/salon/` with stable filenames documented in `docs/figma/landing.md`

## 2. i18n foundation

- [ ] 2.1 [ui] Add `landing.*` message keys (header, hero, philosophy, services, pricing, products, testimonials, hours, footer, legal) to `messages/en.json`
- [ ] 2.2 [ui] Add matching complete Vietnamese translations to `messages/vi.json`

## 3. Landing shell + section components

- [ ] 3.1 [ui] Create `src/components/marketing/landing/` folder and `LandingPageView.tsx` orchestrator inside AppShell 1280px
- [ ] 3.2 [ui] Implement `LandingHeader.tsx` from Figma (logo, nav, LanguageSwitcher, Book CTA)
- [ ] 3.3 [ui] Implement `LandingHero.tsx` from Figma with subtle motion
- [ ] 3.4 [ui] Implement `LandingPhilosophy.tsx` from Figma
- [ ] 3.5 [ui] Implement `LandingServices.tsx` (three curated service cards) from Figma
- [ ] 3.6 [ui] Implement `LandingPricing.tsx` (Treatments & Prices) — new section from Figma
- [ ] 3.7 [ui] Implement `LandingProducts.tsx` (Our Nail Products grid) — new section from Figma
- [ ] 3.8 [ui] Implement `LandingTestimonials.tsx` (three review cards) from Figma
- [ ] 3.9 [ui] Implement `LandingHoursCta.tsx` (working hours + dual appointment CTAs) from Figma
- [ ] 3.10 [ui] Implement `LandingFooter.tsx` from Figma (Menu, Service, Social, copyright, legal)
- [ ] 3.11 [ui] Wire `(user)/page.tsx` to `LandingPageView`; update `marketing/index.ts` exports

## 4. Responsive + motion pass

- [ ] 4.1 [ui] Add responsive stacks for hero, philosophy, services, products, testimonials, hours/CTA at `md`/`lg` breakpoints
- [ ] 4.2 [ui] Add subtle section enter/hover motion with `prefers-reduced-motion` fallback

## 5. Legacy cleanup

- [ ] 5.1 [ui] Remove unused marketing components (`BrandMoment`, `BookingCtaSection`, `ContactSection`, superseded section files) after grep confirms zero imports
- [ ] 5.2 [ui] Delete or replace `HomePageView.tsx` if fully superseded by `LandingPageView`

## 6. Verification

- [ ] 6.1 [ui] Visual check: each landing section vs Figma frame `13:576` at desktop width within 1280px shell
- [ ] 6.2 [ui] Visual check: mobile stack at ~375px width — readable order, no horizontal overflow
- [ ] 6.3 [ui] Toggle locale EN/VI — all landing strings present, no missing keys
- [ ] 6.4 [ui] Confirm Book CTAs navigate to `/book`; header/footer anchors work
- [ ] 6.5 [ui] Run `pnpm type-check` and `pnpm lint`; fix regressions
