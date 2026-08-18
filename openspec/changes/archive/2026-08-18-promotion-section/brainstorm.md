## Design Summary

Add a configurable **Promotion** section on the public landing page immediately after the Hero. Admin manages a **single promotion record** embedded in the existing `SalonSettings` singleton (same pattern as schedule settings): toggle visibility, title, description, optional start/end dates, and one Cloudinary-hosted image. Landing shows the section only when `enabled` is true and the current salon-local date falls within any provided date bounds (empty dates = no bound). Uploading a replacement image MUST delete the previous Cloudinary asset using stored `imagePublicId` to avoid storage bloat.

Visual design: **Editorial Spotlight** — two-column layout on desktop, stacked on mobile; subtle grid/checker background; Lucide icons; static contextual i18n lines (“Visit our salon…”, “Book to experience…”); image in a flexible frame with `object-contain` so square, portrait, landscape, and circular crops all work.

## Alternatives Considered

### Alternative A: Separate `Promotion` MongoDB collection

- **Approach**: Dedicated collection with `findOne()` singleton document.
- **Pros**: Clean separation from schedule fields; easier to reason about promotion-only migrations.
- **Cons**: Extra server helpers, duplicate singleton pattern, another GET route; overkill for one editable banner.
- **Why not chosen**: Averie already uses `SalonSettings` as the settings singleton; extending it matches schedule settings UX.

### Alternative B: Center Stage Card (single centered card, image on top)

- **Approach**: Full-width card with image above text, centered on page.
- **Pros**: Simple layout; works well for wide banners.
- **Cons**: Poor fit for tall portrait or circular assets; less editorial continuity with Hero/Philosophy.
- **Why not chosen**: User requirement for arbitrary image aspect ratios favors a side-by-side spotlight frame.

### Alternative C: Floating Polaroid (rotated image card + bubbles)

- **Approach**: Decorative polaroid-style image with rotation, reusing `LandingBubbles`.
- **Pros**: Strong brand personality; playful spa feel.
- **Cons**: Assumes roughly photo aspect ratio; rotation hurts accessibility; harder to keep text readable with extreme image sizes.
- **Why not chosen**: Editorial Spotlight balances beauty with flexible image containment.

## Agreed Approach

**Alternative A (data)** rejected in favor of **extending `SalonSettings.promotion` subdocument** + **Editorial Spotlight (visual from exploration)**.

- **Placement**: `LandingHero` → **`LandingPromotion`** → `LandingPhilosophy` → …
- **Visibility (Option B — user confirmed)**:
    - `enabled === false` → never show.
    - `startDate` empty → no start bound.
    - `endDate` empty → no end bound.
    - Both empty → show whenever enabled (until admin turns off).
    - When both set → show only if today (salon timezone) is inclusive within range.
- **Cloudinary lifecycle**:
    - Persist `imageUrl` + `imagePublicId` (+ optional `width`/`height` for layout hints).
    - On new upload: upload to `Averie/promotion`, then delete prior `imagePublicId` if present (best-effort log on delete failure, still save new image).
    - On explicit “Remove image”: delete Cloudinary asset and clear fields.
- **Admin**: New settings tab `/admin/settings/promotion` alongside Account and Schedule; form mirrors schedule settings (toggle, fields, image upload preview, save toast).
- **API**: Public `GET /api/settings/promotion`; mutations via Server Actions only (`updatePromotionSettingsAction`, `uploadPromotionImageAction`).

## Key Decisions

| Decision             | Choice                                                         |
| -------------------- | -------------------------------------------------------------- |
| Date range semantics | Optional bounds (Option B); empty = unbounded side             |
| Data model           | `SalonSettings.promotion` embedded object, single doc          |
| Image storage        | Cloudinary; DB stores URL + publicId                           |
| Old image cleanup    | Delete by publicId before/after successful replace             |
| Landing layout       | Editorial Spotlight, grid background, FadeIn, Lucide           |
| Contextual copy      | Fixed i18n keys in `messages/*/salon.json`, not admin-editable |
| Timezone for dates   | Reuse salon timezone helpers from booking schedule utils       |

## Open Questions

- None blocking implementation. (Optional future: admin live preview panel — out of scope.)
