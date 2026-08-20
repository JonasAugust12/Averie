## Context

`GET /api/bookings` is the admin read endpoint for paginated bookings. It currently applies filters, returns `items`, `total`, `page`, and `limit`, and the admin page derives stats from the returned `items`. Because `items` is paginated, the stats are page-local rather than dataset-level. Booking documents persist `status` as `upcoming | cancelled`; a past appointment can still have persisted status `upcoming`.

The codebase already has salon-local time helpers in `src/utils/booking-schedule.util.ts`, with `SALON_TIMEZONE` defaulting to `America/New_York`. The implementation should build on that instead of using the browser or server machine timezone.

## Goals / Non-Goals

**Goals:**

- Return full filtered booking stats from `GET /api/bookings`.
- Add a derived completed bucket for `upcoming` bookings whose appointment date/time has passed in salon time.
- Show completed labels/counts in `/admin/bookings`.
- Keep persisted booking status unchanged.
- Update TypeScript DTOs, OpenAPI schemas/examples, and generated Swagger docs.

**Non-Goals:**

- Do not add a background job or migration to rewrite old bookings.
- Do not change `cancelBookingAction` or `restoreBookingAction` to persist `completed`.
- Do not change public booking confirmation behavior unless it consumes shared DTO fields safely.
- Do not refactor unrelated schedule/calendar analytics.

## Decisions

1. **Use derived display state instead of persisted status**
    - Add a DTO-level field such as `displayStatus: 'upcoming' | 'cancelled' | 'completed'`.
    - `status` remains the persisted database lifecycle value.
    - This preserves existing mutation contracts and avoids migration work.

2. **Compute stats in the API**
    - `GET /api/bookings` should return `stats` in the response data.
    - The route should compute stats using the same search/date filters as the list, but not the current page offset/limit.
    - Status tab filtering needs clear semantics:
        - `upcoming` should represent future upcoming appointments.
        - `completed` should represent past upcoming appointments.
        - `cancelled` should represent persisted cancelled bookings.
    - If implementation keeps the existing `status` query for compatibility, add a separate display-state query such as `state` only if necessary. Avoid breaking existing `status=upcoming|cancelled` callers.

3. **Centralize appointment-state derivation**
    - Put time comparison logic in a shared utility rather than embedding it in the route and components.
    - Use salon-local `{ isoDate, minutes }` from existing helpers and `minuteOf(time)` to avoid timezone drift.
    - A booking is completed when persisted status is `upcoming` and `(booking.date < today || booking.date === today && bookingStartMinutes < nowMinutes)`.

4. **Keep OpenAPI explicit**
    - Update Zod schemas for booking DTO/list response and examples.
    - Regenerate OpenAPI so Swagger reflects the added fields.

## Risks / Trade-offs

- **Boundary timing around appointment end vs start** -> The user described "da qua lich hen" by scheduled time. Use appointment start time unless product later asks to wait until `time + totalEstimatedMinutes`.
- **Query compatibility** -> Existing `status=upcoming` callers may expect persisted upcoming, while UI wants future upcoming. Mitigate by documenting any new `state` query and keeping `status` behavior stable unless implementation confirms no external consumers.
- **Mongo aggregation complexity** -> Search filters with phone regexes can be reused, but completed bucketing is simpler and safer with count queries split by date/time boundaries than with a large aggregation.
- **Generated docs churn** -> `pnpm openapi:gen` may update generated JSON. Keep changes limited to Swagger output caused by this response shape.

## Migration Plan

1. Implement utility/type/API/UI/OpenAPI changes in one apply iteration.
2. Run `pnpm type-check`.
3. Run `pnpm openapi:gen`.
4. Run `pnpm lint` if the touched UI/API surface triggers formatting or lint uncertainty.
5. Rollback by removing the additive `stats`/display-state fields and returning UI to existing page-local stats.
