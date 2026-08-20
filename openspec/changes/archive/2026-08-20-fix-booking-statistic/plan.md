# Fix Booking Statistic Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development
> to implement this plan task-by-task.

**Goal:** Make admin booking stats represent the full filtered dataset and display past upcoming appointments as completed without mutating booking documents.

**Architecture:** Keep persisted booking `status` as `upcoming | cancelled`. Add DTO-level derived state and API-level stats to `GET /api/bookings`, then render those values in the admin bookings UI. Documentation follows the changed API contract through Zod OpenAPI schemas, examples, and generated Swagger output.

**Tech Stack:** Next.js 15 App Router, Mongoose, Zod, TanStack Query, next-intl, Tailwind CSS, OpenAPI generation.

---

## Task 1: API Contract And Derived State

- [ ] **Step 1:** Inspect `src/types/booking.type.ts`, `src/types/salon-common.type.ts`, and existing status usage to choose the final derived field name, preferably `displayStatus`.
- [ ] **Step 2:** Add `BookingDisplayStatus = 'upcoming' | 'cancelled' | 'completed'` and `BookingListStatsDto` types.
- [ ] **Step 3:** Add `displayStatus` and `stats` fields to the relevant DTO interfaces.
- [ ] **Step 4:** In a shared utility, implement `getBookingDisplayStatus({ status, date, time }, now?)` using `getSalonLocalDateTime()` and `minuteOf(time)`.
- [ ] **Step 5:** Add small focused tests if the repo already has a test harness for utilities; otherwise prepare manual verification cases for yesterday, today earlier time, today future time, and cancelled.
- [ ] **Step 6:** Update `serializeBooking` or `serializeBookingListItem` so returned booking DTOs include `displayStatus`.
- [ ] **Step 7:** Update `src/app/api/bookings/route.ts` to compute stats over the full filtered dataset, not the paginated query.
- [ ] **Step 8:** Keep pagination query behavior unchanged and return `{ items, total, page, limit, stats }` through `apiSuccess`.
- [ ] **Step 9:** Confirm `status` query compatibility remains clear; if adding a display-state query is necessary for completed filtering, update validation and route parsing together.

## Task 2: Admin Bookings UI

- [ ] **Step 1:** Replace the `useMemo` stats calculation in `src/app/admin/bookings/page.tsx` with `data?.stats` fallback defaults.
- [ ] **Step 2:** Add a completed stat card using an appropriate Lucide icon and existing `BookingStatCard` styling patterns.
- [ ] **Step 3:** Extend `BookingFilters` stats shape and status tab definitions to include completed if the UI needs it as a filterable tab.
- [ ] **Step 4:** Update `BookingStatusBadge` to accept the derived display status and render completed with neutral/completed styling.
- [ ] **Step 5:** Update `BookingTableRow` and mobile card rendering to pass `displayStatus` and label from translations.
- [ ] **Step 6:** Verify cancel/restore controls continue checking persisted `booking.status`, not the derived display state.
- [ ] **Step 7:** Add `status.completed` and `bookings.stats.completed` in `messages/en/admin.json` and `messages/vi/admin.json`.

## Task 3: API Documentation And Verification

- [ ] **Step 1:** Update `src/openapi/schemas/booking.schema.ts` with display status and list stats schemas.
- [ ] **Step 2:** Update `src/openapi/examples/booking.examples.ts` so paginated bookings examples include `stats`.
- [ ] **Step 3:** Check `src/openapi/examples/responses.ts` still injects the updated example correctly.
- [ ] **Step 4:** Run `pnpm openapi:gen`.
- [ ] **Step 5:** Run `pnpm type-check`.
- [ ] **Step 6:** Run `pnpm lint` if UI changes are broad or formatting-sensitive.
- [ ] **Step 7:** Manually inspect the generated `GET /api/bookings` schema/example for `stats.completed` and the derived display status field.
