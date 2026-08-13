## Design Summary

Re-align all **non-landing** salon UI screens to Stitch project `10694160950357827758` by fetching each screen’s HTML + screenshot before porting to React/Tailwind. Landing was already aligned from Stitch HTML (`docs/stitch/landing.html`) and is **out of scope** unless a regression appears.

**In scope clusters:** `book` (7 Stitch steps + confirmation), `account` (client + admin login), `admin` (shell + all dashboard screens).

**Constraints carried forward:** mock data only; AppShell ≤1280; Averie theme tokens; EN default + VI; no HTML paste wholesale; Tailwind **canonical class names** (avoid arbitrary values when a scale token exists, e.g. `md:leading-12` not `md:leading-[48px]`).

### Screen inventory (remaining)

| Cluster | Stitch screen          | Averie route / surface       |
| ------- | ---------------------- | ---------------------------- |
| book    | Select Service         | `/book` step 1               |
| book    | Select Employee        | `/book` step 2               |
| book    | Select Date            | `/book` step 3               |
| book    | Select Time            | `/book` step 4               |
| book    | Customer Information   | `/book` step 5               |
| book    | Review Details         | `/book` step 6               |
| book    | Confirmation           | `/book/confirmation`         |
| account | Client Login           | `/login`                     |
| account | Admin Login            | `/admin/login`               |
| admin   | Overview               | `/admin`                     |
| admin   | Bookings List          | `/admin/bookings`            |
| admin   | Booking Details        | `/admin/bookings/[id]`       |
| admin   | Service Management     | `/admin/services`            |
| admin   | Staff Management       | `/admin/staff`               |
| admin   | Staff Schedule Details | `/admin/staff/[id]/schedule` |
| admin   | Master Schedule        | `/admin/schedule`            |
| admin   | Shift Management       | `/admin/shifts`              |
| admin   | Schedule Settings      | `/admin/settings/schedule`   |

## Alternatives Considered

### Alternative A: Full Stitch HTML fidelity pass (chosen)

- **Approach:** Per screen: fetch HTML+image → port structure/components → map colors to Averie tokens → keep mocks/i18n.
- **Pros:** Matches user complaint; mirrors successful landing fix.
- **Cons:** Large surface; needs clustered tasks.
- **Why not chosen:** N/A — chosen.

### Alternative B: UI/UX Pro Max free redesign

- **Approach:** Polish without Stitch HTML.
- **Pros:** Faster.
- **Cons:** Will diverge from owner’s Stitch source of truth again.
- **Why not chosen:** User explicitly wants Stitch alignment.

### Alternative C: Only book first, admin later

- **Approach:** Split into two changes.
- **Pros:** Smaller PRs.
- **Cons:** Explore locked book+login+admin in one change.
- **Why not chosen:** Scope already decided.

## Agreed Approach

Alternative A with delivery order **book → account → admin**. Save HTML refs under `docs/stitch/`. Preserve Server `page` + metadata for `(user)`; admin stays client-capable. Apply Tailwind canonical classes during port.

## Key Decisions

- New change (do not reopen completed `nail-booking-ui-from-stitch` apply).
- Landing excluded unless regression.
- Stitch HTML is LOOk truth; Averie tokens win color conflicts; AppShell width kept.
- Canonical Tailwind required in implement/review checklist.

## Open Questions

- Whether Stitch MCP `get_screen` CallMcpTool works in-session or HTTP fetch script is needed — either acceptable; document refs in `docs/stitch/`.
