# Align Remaining Screens to Stitch — Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development
> task-by-task. Fetch Stitch HTML before each screen port. Prefer UI/UX Pro Max only for polish after structure matches Stitch.

**Goal:** Realign booking, login, and admin UIs to Stitch HTML for project `10694160950357827758`, excluding landing (already done).

**Architecture:** Keep existing routes, mocks, and Server `page` + client view split. Rewrite view components against Stitch HTML; map colors to Averie tokens; AppShell ≤1280. Store refs in `docs/stitch/`.

**Tech Stack:** Next.js App Router, React, Tailwind 4 (canonical classes), Lucide, next-intl, RHF+Zod, TanStack Query mocks.

**Global constraints:** No API/Mongo/real auth; no HTML paste; no landing rewrite; `suggestCanonicalClasses` hygiene.

---

## Task 1: Fetch Stitch refs

- [ ] **Step 1:** List in-scope screenIds from inventory / Stitch MCP.
- [ ] **Step 2:** Fetch HTML (and PNG if available) for each into `docs/stitch/`.
- [ ] **Step 3:** Write `docs/stitch/README.md` mapping screen → file → route.
- [ ] **Step 4:** Confirm landing HTML already present; do not overwrite unless broken.

## Task 2: Book wizard fidelity

- [ ] **Step 1:** Read Select Service HTML; rewrite `BookingChrome` + `BookingSummary` + `ServiceStep`.
- [ ] **Step 2:** Port Employee, Date, Time steps from their HTML refs.
- [ ] **Step 3:** Port Customer (preserve Zod), Review, Confirmation.
- [ ] **Step 4:** Replace avoidable arbitrary Tailwind with canonical classes.
- [ ] **Step 5:** Manual compare `/book` steps to refs; fix gaps.
- [ ] **Step 6:** `pnpm type-check`.

## Task 3: Account logins fidelity

- [ ] **Step 1:** Port `ClientLoginView` from Client Login HTML.
- [ ] **Step 2:** Port admin login page from Admin Login HTML (keep mock gate).
- [ ] **Step 3:** Canonical Tailwind + i18n check; type-check.

## Task 4: Admin fidelity

- [ ] **Step 1:** Port `AdminShell` chrome from Overview HTML.
- [ ] **Step 2:** Port Overview, Bookings list/detail.
- [ ] **Step 3:** Port Services, Staff, Staff schedule detail.
- [ ] **Step 4:** Port Master schedule, Shifts, Schedule settings.
- [ ] **Step 5:** Canonical Tailwind sweep; type-check; smoke each nav link.

## Task 5: Verification

- [ ] **Step 1:** Smoke `/` landing — unchanged appearance.
- [ ] **Step 2:** Walk book happy path + both logins + admin nav.
- [ ] **Step 3:** Confirm `docs/stitch` coverage for all in-scope screens.
- [ ] **Step 4:** Final `pnpm type-check`.

---

## Apply notes

- Prefer fetch script / MCP that returns `htmlCode.downloadUrl` when CallMcpTool flakes.
- Do not expand scope to landing visual redesign.
- Do not add booking Route Handlers or Mongo models.
