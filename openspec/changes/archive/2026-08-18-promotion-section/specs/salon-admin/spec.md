## ADDED Requirements

### Requirement: Admin promotion settings page

The system SHALL provide an admin settings page at `/admin/settings/promotion` accessible to authenticated admins, using the shared AdminSettings layout and navigation tabs.

The page MUST allow operators to toggle promotion visibility (`enabled`), edit title and description, set optional start and end dates, toggle `hideAfterExpiry`, upload or replace the promotion image with preview, remove the image, and save changes with success feedback consistent with other admin settings pages.

#### Scenario: Open promotion settings

- **WHEN** an admin navigates to `/admin/settings/promotion`
- **THEN** the UI MUST display the current promotion settings loaded from `GET /api/settings/promotion`
- **AND** MUST show a Promotion tab as active in AdminSettingsNav

#### Scenario: Save promotion text fields

- **WHEN** an admin saves title, description, enabled, or date fields
- **THEN** `updatePromotionSettingsAction` MUST persist changes
- **AND** a success toast MUST be shown using existing admin toast patterns

#### Scenario: Replace image deletes old Cloudinary asset

- **WHEN** an admin uploads a new image while an existing `imagePublicId` is stored
- **THEN** the UI flow MUST invoke the upload action that replaces the image and deletes the prior Cloudinary asset per salon-promotion requirements

---

## MODIFIED Requirements

### Requirement: Schedule settings mutation

The system SHALL provide `updateScheduleSettingsAction` to update the singleton `salon_settings` document fields (`allowStaffSelection`, `allowGuestLanguageSwitch`, `weekdaySchedules`, `dayOffs`, and other schedule settings fields).

The `salon_settings` document MAY also contain `promotion` fields updated by promotion Server Actions; schedule actions MUST NOT overwrite unrelated `promotion` fields when updating schedule data.

#### Scenario: Read then update settings

- **WHEN** an admin updates schedule settings
- **THEN** subsequent `GET /api/settings/schedule` MUST reflect the new values
- **AND** `GET /api/settings/promotion` MUST remain unchanged unless promotion was explicitly updated
