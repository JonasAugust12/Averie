## ADDED Requirements

### Requirement: Singleton promotion settings

The system SHALL store exactly one promotion configuration on the singleton `salon_settings` document in an embedded `promotion` object with fields: `enabled` (boolean), `title` (string), `description` (string), `startDate` (nullable `YYYY-MM-DD` string), `endDate` (nullable `YYYY-MM-DD` string), `hideAfterExpiry` (boolean, default true), `imageUrl` (nullable string), `imagePublicId` (nullable string), and optional `imageWidth` / `imageHeight` (nullable numbers).

The system MUST NOT create a separate promotions collection or multiple promotion records.

#### Scenario: Default promotion on fresh settings

- **WHEN** the singleton `salon_settings` document is created or migrated without promotion data
- **THEN** `promotion.enabled` MUST default to `false`
- **AND** text and image fields MUST default to empty or null such that the landing promotion section is not shown

---

### Requirement: Optional date bounds (Option B)

Promotion visibility date bounds MUST be optional. An empty or null `startDate` MUST NOT impose a start constraint. An empty or null `endDate` MUST NOT impose an end constraint. When both bounds are empty and `enabled` is true, the promotion MUST remain visible until an operator disables it.

Date comparisons MUST use the salon timezone day boundary consistent with booking schedule utilities.

#### Scenario: Open-ended promotion

- **WHEN** `promotion.enabled` is true and both `startDate` and `endDate` are null or empty
- **THEN** the promotion MUST be considered visible regardless of calendar date

#### Scenario: Start-only bound

- **WHEN** `promotion.enabled` is true, `startDate` is set, `endDate` is empty, and today's salon-local date is on or after `startDate`
- **THEN** the promotion MUST be visible

#### Scenario: End-only bound

- **WHEN** `promotion.enabled` is true, `endDate` is set, `startDate` is empty, and today's salon-local date is on or before `endDate`
- **THEN** the promotion MUST be visible

#### Scenario: Outside optional range

- **WHEN** `promotion.enabled` is true, both dates are set, and today's salon-local date is before `startDate` OR after `endDate`
- **THEN** the promotion MUST NOT be visible on the landing page when `hideAfterExpiry` is true (default)

#### Scenario: Past end date but hide disabled

- **WHEN** `promotion.enabled` is true, `endDate` is set, today's salon-local date is after `endDate`, and `hideAfterExpiry` is false
- **THEN** the promotion MUST remain visible on the landing page until the operator disables it

---

### Requirement: Hide after expiry toggle

The system SHALL persist `hideAfterExpiry` (boolean, default `true`) on `salon_settings.promotion`. When `true`, an `endDate` in the past MUST hide the landing section. When `false`, the end date MUST NOT auto-hide the section (start date rules still apply).

Admin promotion settings MUST expose this as a toggle saved via `updatePromotionSettingsAction`.

#### Scenario: Default hides after expiry

- **WHEN** promotion settings are created without `hideAfterExpiry`
- **THEN** `hideAfterExpiry` MUST default to `true`

---

### Requirement: Promotion visibility helper

The system SHALL expose a shared function (e.g. `isPromotionVisible(promotion, now?)`) that returns true only when `enabled` is true and optional date bounds pass.

#### Scenario: Disabled promotion

- **WHEN** `promotion.enabled` is false
- **THEN** `isPromotionVisible` MUST return false regardless of dates or image

---

### Requirement: Public promotion read API

The system SHALL provide `GET /api/settings/promotion` returning the promotion DTO (including visibility-relevant fields) with the standard API envelope `{ status, message, data }`.

The route MUST NOT require authentication.

#### Scenario: Landing fetches promotion

- **WHEN** a client calls `GET /api/settings/promotion`
- **THEN** the response data MUST include `enabled`, `title`, `description`, `startDate`, `endDate`, `imageUrl`, and derived or explicit visibility as documented in the DTO

---

### Requirement: Admin promotion mutations via Server Actions

The system SHALL provide admin-only Server Actions to update promotion text/toggle/dates and to upload or remove the promotion image. Internal CRUD mutations MUST NOT be exposed on Route Handlers.

Actions MUST use Zod validation and return `apiSuccessResult` / `apiErrorResult`.

#### Scenario: Admin updates copy without image

- **WHEN** an authenticated admin submits valid promotion fields via `updatePromotionSettingsAction`
- **THEN** the singleton `salon_settings.promotion` document MUST persist the new values
- **AND** subsequent `GET /api/settings/promotion` MUST reflect the update

---

### Requirement: Cloudinary promotion image upload

The system SHALL upload promotion images to Cloudinary under folder `Averie/promotion` using server-side credentials from environment variables. Upload MUST apply `quality: auto` and `fetch_format: auto` transformations.

After a successful upload, the system MUST persist `imageUrl`, `imagePublicId`, and dimensions on `salon_settings.promotion`.

#### Scenario: First image upload

- **WHEN** an admin uploads a valid image and no prior `imagePublicId` exists
- **THEN** the new Cloudinary asset MUST be stored and referenced in MongoDB
- **AND** no delete call is required for a previous asset

---

### Requirement: Cloudinary replace deletes previous asset

When an admin uploads a replacement promotion image and a previous `imagePublicId` exists, the system MUST attempt to delete the previous Cloudinary asset by `publicId` before or immediately after persisting the new asset. Delete failure MUST be logged but MUST NOT prevent saving the new image reference if upload succeeded.

#### Scenario: Replace existing promotion image

- **WHEN** an admin uploads a new image while `imagePublicId` is `Averie/promotion/old123`
- **THEN** the system MUST upload the new file, delete `old123` on Cloudinary, and store the new `imagePublicId`

---

### Requirement: Cloudinary remove image action

The system SHALL provide an admin action to remove the promotion image that deletes the Cloudinary asset when `imagePublicId` is set and clears `imageUrl`, `imagePublicId`, and dimension fields in MongoDB.

#### Scenario: Admin removes image

- **WHEN** an admin invokes remove image on a promotion with a stored `imagePublicId`
- **THEN** Cloudinary destroy MUST be called for that publicId
- **AND** image fields in MongoDB MUST be cleared

---

### Requirement: Promotion image validation

Upload actions MUST reject files over 5 MB and MUST accept only `image/jpeg`, `image/png`, and `image/webp` MIME types.

#### Scenario: Oversized upload rejected

- **WHEN** an admin uploads a file larger than 5 MB
- **THEN** the action MUST return a validation error without modifying stored promotion data
