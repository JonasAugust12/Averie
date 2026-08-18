## 1. Dependencies and environment [db]

- [x] 1.1 [db] Add `cloudinary` package via pnpm and document env vars in `.env.example` (already commented — uncomment with brief note)
- [x] 1.2 [db] Extend `SalonSettings` Mongoose schema with `promotion` subdocument defaults

## 2. Types, validation, and visibility [db]

- [x] 2.1 [db] Add `PromotionSettingsDto`, types in `@typings/promotion-settings.type.ts`
- [x] 2.2 [db] Add Zod schemas: `updatePromotionSettingsSchema`, upload constraints in `@validations/promotion-settings.schema.ts`
- [x] 2.3 [db] Add `serializePromotionSettings` mapper and `isPromotionVisible()` in `@utils/promotion.util.ts` (salon TZ dates)

## 3. Cloudinary server helper [action]

- [x] 3.1 [action] Create `src/libs/cloudinary.server.ts` with configure, uploadPromotionImage, deleteCloudinaryImage (folder `Averie/promotion`)
- [x] 3.2 [action] Unit-test or manual-test upload/delete in dev with env vars

## 4. Server layer and API [api] [action]

- [x] 4.1 [api] Add `getPromotionSettingsDto()` in server module (extend or sibling to schedule.server)
- [x] 4.2 [api] Create `GET /api/settings/promotion/route.ts` public read
- [x] 4.3 [action] Create `updatePromotionSettingsAction` (admin, partial text/toggle/dates)
- [x] 4.4 [action] Create `uploadPromotionImageAction` (FormData, replace + delete old publicId)
- [x] 4.5 [action] Create `removePromotionImageAction` (delete publicId + clear fields)

## 5. Client services and hooks [ui]

- [x] 5.1 [ui] Add `usePromotionSettings()` TanStack Query hook in `@services/promotion.service.ts`
- [x] 5.2 [ui] Add mutation hooks for update/upload/remove wrapping actions

## 6. Landing Promotion section [ui]

- [x] 6.1 [ui] Create `LandingPromotion.tsx` — Editorial Spotlight, grid bg, Lucide, FadeIn, object-contain image
- [x] 6.2 [ui] Wire into `LandingPageView` after `LandingHero`; hide when not visible or no image
- [x] 6.3 [ui] Add i18n keys to `messages/en/salon.json` and `messages/vi/salon.json` (contextual lines + eyebrow)

## 7. Admin Promotion settings tab [ui] [auth]

- [x] 7.1 [ui] Add Promotion tab to `AdminSettingsNav` (`/admin/settings/promotion`)
- [x] 7.2 [ui] Create `src/app/admin/settings/promotion/page.tsx` with form, image upload preview, remove, save toasts
- [x] 7.3 [ui] Add admin i18n keys in `messages/en/admin.json` and `messages/vi/admin.json` + `settingsNav.promotion`

## 8. OpenAPI and docs [api]

- [x] 8.1 [api] Add OpenAPI fragment for `GET /api/settings/promotion` and promotion DTO if project convention requires

## 9. Verification [ui]

- [x] 9.1 Run `pnpm type-check` and `pnpm lint`
- [x] 9.2 Manual test: enable promo, upload image, verify landing; replace image, confirm old deleted; optional dates B; disable toggle
