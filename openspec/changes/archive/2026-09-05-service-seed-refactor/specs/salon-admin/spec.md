## MODIFIED Requirements

### Requirement: Service category CRUD mutations

The system SHALL provide Server Actions to create, update, and delete service categories, restricted to admin role.

Category create and update inputs MUST accept `slug`, `subtitle`, `description`, `note`, and `featured` in addition to `name`, `sortOrder`, and `icon`.

The admin category form MUST expose editable fields for `name`, `icon`, `subtitle`, `description`, `note`, and `featured`. On create, `slug` MUST be required or auto-generated from `name`; on edit, `slug` MUST be read-only.

#### Scenario: Create category

- **WHEN** an admin calls `createServiceCategoryAction` with a valid name and slug
- **THEN** the action MUST return status 201 with the new category DTO including all marketing fields

#### Scenario: Update category marketing fields

- **WHEN** an admin updates a category's `subtitle`, `description`, `note`, or `featured` via `updateServiceCategoryAction`
- **THEN** the persisted document and returned DTO MUST reflect the updated values

#### Scenario: Admin category form shows marketing fields

- **WHEN** an operator opens the create or edit category modal on `/admin/services`
- **THEN** the form MUST include inputs for subtitle, description, note, and featured toggle
