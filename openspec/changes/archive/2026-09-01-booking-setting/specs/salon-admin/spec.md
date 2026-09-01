## MODIFIED Requirements

### Requirement: Schedule settings mutation

The system SHALL provide `updateScheduleSettingsAction` to update the singleton `salon_settings` document fields (`allowStaffSelection`, `allowGuestLanguageSwitch`, `bookingEnabled`, `weekdaySchedules`, `dayOffs`, and other schedule settings fields).

The `salon_settings` document MAY also contain `promotion` fields updated by promotion Server Actions; schedule actions MUST NOT overwrite unrelated `promotion` fields when updating schedule data.

#### Scenario: Read then update settings

- **WHEN** an admin updates schedule settings including `bookingEnabled`
- **THEN** subsequent `GET /api/settings/schedule` MUST reflect the new values including `bookingEnabled`
- **AND** `GET /api/settings/promotion` MUST remain unchanged unless promotion was explicitly updated

#### Scenario: Toggle online booking off

- **WHEN** an admin sets `bookingEnabled` to `false` via the schedule settings page and saves
- **THEN** `updateScheduleSettingsAction` MUST persist the value
- **AND** a success toast MUST be shown using existing admin toast patterns

---

## ADDED Requirements

### Requirement: Admin online booking toggle UI

The admin schedule settings page at `/admin/settings/schedule` MUST expose a control to set `bookingEnabled` (online booking on/off) with a clear label and short description, consistent with other schedule settings form patterns.

#### Scenario: Toggle visible on schedule settings

- **WHEN** an admin opens `/admin/settings/schedule`
- **THEN** the UI MUST display the current `bookingEnabled` value loaded from `GET /api/settings/schedule`
- **AND** MUST allow saving the toggle with the existing schedule save action
