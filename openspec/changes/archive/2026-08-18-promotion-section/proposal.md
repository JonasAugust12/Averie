## Why

The Averie landing page has no way to highlight time-bound salon offers (seasonal promotions, new services, holiday specials). Operators currently cannot update marketing banners without a code deploy. A single admin-configurable promotion section after the Hero lets the salon promote offers in EN/VI while keeping the rest of the landing stable. Cloudinary-backed image upload with replace-and-delete avoids filling storage when creatives change.

## What Changes

**Landing page section order**

- From: Hero → Philosophy → …
- To: Hero → **Promotion (conditional)** → Philosophy → …
- Reason: Promotion is timely marketing; Hero remains brand anchor.
- Impact: Non-breaking addition; section omitted when disabled or out of optional date range.

**Salon settings data**

- From: `SalonSettings` holds schedule-related fields only.
- To: `SalonSettings.promotion` embeds enabled, title, description, optional startDate/endDate, imageUrl, imagePublicId.
- Reason: Single editable promotion record, same pattern as schedule settings.
- Impact: Non-breaking; defaults keep promotion hidden.

**Admin settings navigation**

- From: Account | Schedule tabs.
- To: Account | Schedule | **Promotion** tab at `/admin/settings/promotion`.
- Reason: Operator self-service configuration.
- Impact: Non-breaking UI addition.

**Cloudinary image lifecycle**

- From: No Cloudinary integration in Averie.
- To: Upload stores url + publicId; replacing or removing an image deletes the previous Cloudinary asset by publicId.
- Reason: Prevent orphaned files consuming Cloudinary quota.
- Impact: Requires `CLOUDINARY_*` env vars in deployment.

**Date range semantics (Option B — agreed)**

- From: N/A
- To: startDate and endDate are optional; empty means no bound on that side; section shows when enabled and within any provided bounds.
- Reason: Operators may run open-ended promos or date-limited campaigns without forced end dates.
- Impact: Visibility logic in shared helper + landing component.

## Capabilities

### New Capabilities

- `salon-promotion`: Singleton promotion settings (MongoDB + Cloudinary), public GET API, admin Server Actions, visibility rules, and image replace/delete lifecycle.

### Modified Capabilities

- `salon-marketing`: Landing page MUST include optional Promotion section after Hero when promotion is visible; localized static contextual copy.
- `salon-admin`: Admin settings MUST include Promotion tab and form to manage promotion fields and image upload.

## Impact

- **Models**: `src/models/salon-settings.model.ts`
- **Server/libs**: `src/libs/cloudinary.server.ts`, `src/server/promotion.server.ts` (or extend schedule.server)
- **API**: `src/app/api/settings/promotion/route.ts` (GET)
- **Actions**: `src/actions/promotion-settings.action.ts`
- **Validations/types/mappers**: promotion schema, DTO, mapper
- **UI**: `LandingPromotion.tsx`, `LandingPageView`, admin settings page + nav
- **i18n**: `messages/en|vi/salon.json`, `messages/en|vi/admin.json`
- **Env**: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- **Dependencies**: add `cloudinary` npm package

## Non-Goals

- Multiple promotion slots or carousel.
- Promotion on `/book` flow or staff portal.
- Image watermarking.
- Automatic scheduled jobs to delete Cloudinary orphans.
