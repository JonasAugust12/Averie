## Context

Averie landing (`LandingPageView`) composes section components after Hero. Admin settings use a tabbed layout (`AdminSettingsNav`) with singleton `SalonSettings` in MongoDB (`getSalonSettingsDocument()`). Schedule settings already demonstrate GET route + Zod-validated Server Action updates. Cloudinary env vars exist in `.env.example` but no upload helper in Averie yet; BRIX-Server provides a reference implementation (`upload_stream`, folder prefix, `destroy` by publicId).

Stakeholders: salon operator (configures promotion), visitors (see offer on landing).

## Goals / Non-Goals

**Goals:**

- Configurable promotion section on landing after Hero.
- Admin toggle + edit single promotion (title, description, optional dates, one image).
- Safe Cloudinary usage: store `publicId`, delete replaced/removed assets.
- Responsive Editorial Spotlight UI matching existing landing tokens (`cream`, `nude`, `FadeIn`, `PillLink`).
- Full EN/VI i18n for static contextual lines; admin strings in `admin.json`.

**Non-Goals:**

- Multiple concurrent promotions or promotion history.
- Guest-editable contextual CTA text (fixed i18n only).
- Watermark overlay on promotion images (BRIX feature not required).
- Separate NestJS upload service — uploads run in Next.js Server Actions.
- Auto-cropping to force aspect ratio (use `object-contain` instead).

## Decisions

### 1. Extend `SalonSettings` with `promotion` subdocument

```typescript
promotion: {
  enabled: boolean;           // default false
  title: string;              // default ''
  description: string;        // default ''
  startDate: string | null;   // YYYY-MM-DD or null
  endDate: string | null;     // YYYY-MM-DD or null
  hideAfterExpiry: boolean;   // default true — auto-hide after endDate
  imageUrl: string | null;
  imagePublicId: string | null;
  imageWidth?: number | null;
  imageHeight?: number | null;
}
```

**Rationale:** Matches singleton settings pattern; one `findByIdAndUpdate` on save.

### 2. Visibility helper `isPromotionVisible(settings, now?)`

```
visible =
  promotion.enabled
  AND (startDate is null OR today >= startDate)
  AND (endDate is null OR today <= endDate OR hideAfterExpiry is false)
```

Use salon timezone date string (same approach as `booking-schedule.util` salon day boundaries).

### 3. Cloudinary module (`src/libs/cloudinary.server.ts`)

- Configure from `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
- `uploadPromotionImage(buffer, mimeType)` → `{ url, publicId, width, height }` folder `Averie/promotion`, transforms `quality: auto`, `fetch_format: auto`.
- `deleteCloudinaryImage(publicId)` → best-effort destroy; log errors, do not block DB update if delete fails after successful upload.

**Replace flow:**

1. Upload new image.
2. If old `imagePublicId` exists, call delete.
3. Persist new url/publicId/dimensions.

**Remove flow:** delete publicId, set image fields to null.

### 4. API & actions

| Operation                | Layer             | Path                                    |
| ------------------------ | ----------------- | --------------------------------------- |
| Read promotion (public)  | GET Route Handler | `/api/settings/promotion`               |
| Update text/toggle/dates | Server Action     | `updatePromotionSettingsAction`         |
| Upload/replace image     | Server Action     | `uploadPromotionImageAction` (FormData) |
| Remove image             | Server Action     | `removePromotionImageAction`            |

All responses use `{ status, message, data }` envelope.

### 5. Landing UI — Editorial Spotlight

- Section id `promotion` for optional anchor links.
- Full-bleed subtle grid background (`landingBleedWhite` or custom checker via CSS gradients).
- Left (md): eyebrow + title + description + two contextual lines with Lucide (`Sparkles`, `MapPin`, `CalendarHeart`) + `PillLink` to `/book`.
- Right: image frame `min-h-[280px] md:min-h-[360px]` with padding; `next/image` `fill` + `object-contain` + `sizes` responsive.
- Animation: `FadeIn` on scroll; respect `prefers-reduced-motion` (no infinite decorative motion).
- If not visible or no image URL, section not rendered (SSR-friendly: fetch promotion in server component wrapper or client query — prefer server pass-through from page for SEO).

### 6. Admin UI — `/admin/settings/promotion`

- Add tab in `AdminSettingsNav` with `ImageIcon` or `Megaphone` Lucide key `promotion`.
- Form: enabled switch, title, description (textarea), start/end date inputs (optional), image dropzone/file input, preview, Replace/Remove buttons.
- Save settings button (text fields) separate from upload action OR combined save with dirty state — recommend: save text/toggle/dates via update action; image via dedicated upload action with immediate preview (like typical media settings).
- Success toasts using existing admin toast keys pattern.

## Risks / Trade-offs

| Risk                                 | Mitigation                                                                |
| ------------------------------------ | ------------------------------------------------------------------------- |
| Cloudinary delete fails after upload | Log warning; store new publicId; orphan cleanup manual/scheduled later    |
| Large image upload on serverless     | Limit file size in action (e.g. 5MB), validate mime `image/jpeg/png/webp` |
| Date timezone edge cases             | Document salon TZ; use same util as booking day keys                      |
| Landing LCP if huge Cloudinary URL   | Use Cloudinary URL transforms `c_limit,w_1200` in mapper                  |
| Missing Cloudinary env in dev        | Admin upload shows clear error; landing hides section if no image         |

## Migration Plan

1. Deploy schema change (Mongoose defaults on embedded `promotion` — no migration script needed for empty defaults).
2. Set Cloudinary env on Vercel.
3. Admin configures promotion; verify landing.
4. Rollback: disable `enabled` flag via admin or revert deploy; old images remain in Cloudinary until deleted manually if rollback mid-upload.

## Open Questions

None.
