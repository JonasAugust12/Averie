## Context

Change `nail-booking-ui-from-stitch` delivered mock-backed routes for marketing, booking, and admin. Landing was later realigned using Stitch HTML export. Remaining surfaces still diverge from Stitch. Project constraints: Averie AppShell ≤1280, theme tokens, next-intl EN/VI, mock-only data.

## Goals / Non-Goals

**Goals:**

- Align book, account (logins), and admin screens to Stitch HTML/structure.
- Keep Server `page` + metadata on `(user)` routes; interactive UI in client views.
- Use Tailwind canonical classes; store HTML refs in `docs/stitch/`.

**Non-Goals:**

- Landing redesign; API/Mongo/real auth; HTML dump; new domain logic.

## Decisions

1. **Stitch HTML first** — For each screen: fetch image+HTML → read layout → port components. Do not invent layout without refs.
2. **Cluster order** — book → account → admin to unlock primary user flow earliest.
3. **Token mapping** — Map Stitch color tokens to Averie `primary` / `secondary` / `tertiary` / `neutral` / `muted` / `border`; prefer existing utilities.
4. **Canonical Tailwind** — Prefer scale classes (`leading-12`, `gap-6`, `rounded-full`) over arbitrary `[…px]` when equivalent exists.
5. **Preserve architecture** — Keep mocks, Zod forms, SEO metadata pattern; only restyle/restructure views.

## Risks / Trade-offs

- [Stitch desktop 2560 vs AppShell 1280] → Compress horizontally; keep hierarchy; verify mobile stacks.
- [MCP tool call flakes] → Use HTTP fetch script / inventory URLs; commit refs to `docs/stitch/`.
- [Scope size] → Strict cluster tasks; no landing drive-bys.

## Migration Plan

- Additive UI refactors only; rollback = git revert per cluster.
- No data migration.

## Open Questions

- None material after explore; apply may note screenId ↔ file mapping in tasks progress.
