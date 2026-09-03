## MODIFIED Requirements

### Requirement: Bookings management UI

The system SHALL provide bookings list and booking detail pages using **API-backed** booking records with layouts consistent with Stitch Bookings List and Booking Details screens, with **server-side** filter and pagination on the list view. The admin bookings UI MUST display a completed state for upcoming bookings whose scheduled salon-local time has passed, without requiring a database status mutation.

The booking detail page MUST provide a **Send email** action that opens a modal allowing an authenticated admin to enter or edit a recipient email address and send a booking confirmation or reminder template for that booking.

#### Scenario: Open booking detail

- **WHEN** an operator selects a booking from the list
- **THEN** the UI MUST load detail via `GET /api/bookings/:id` (or enriched list item) and MUST show the Stitch-aligned detail composition

#### Scenario: Cancel booking via action

- **WHEN** an operator confirms cancel on an upcoming booking
- **THEN** the UI MUST call `cancelBookingAction` and MUST refresh the bookings query

#### Scenario: Past upcoming row shows completed

- **WHEN** an admin bookings table row represents a booking with persisted `status: upcoming` and a derived completed display state
- **THEN** the row status badge MUST show the completed label and styling instead of the upcoming label

#### Scenario: Admin sends booking email manually

- **WHEN** an operator opens the send-email modal on a booking detail page, enters a valid recipient email, selects a template, and confirms
- **THEN** the UI MUST call `sendBookingEmailAction` with `bookingId`, `to`, and `template`
- **AND** MUST show a success toast when the action returns status 200

#### Scenario: Admin send requires recipient

- **WHEN** an operator submits the send-email modal with an empty or invalid email
- **THEN** the UI MUST block submission and show validation feedback
