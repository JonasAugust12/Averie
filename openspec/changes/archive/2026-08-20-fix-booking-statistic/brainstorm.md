## Design Summary

Admin bookings currently shows upcoming and cancelled counts derived from the current paginated page. That makes the statistic cards and status filter tab counts misleading as soon as the operator moves between pages or searches across more records than the current `items` payload. The fix should move aggregate counts into `GET /api/bookings`, then let the admin UI render those API-level stats instead of recomputing them from visible rows.

The change also needs a third derived lifecycle bucket for appointments that are still stored as `status: upcoming` but whose scheduled salon-local date and time have already passed. This bucket is displayed as `completed` in admin UI and counted separately, without mutating existing booking documents or introducing a scheduled database cleanup job.

## Alternatives Considered

### Alternative A: Count Current Page in UI

- **Approach**: Keep the current `useMemo` over `data.items` and only rename labels or add client logic for completed rows.
- **Pros**: Smallest code change and no API contract change.
- **Cons**: Keeps the core bug because stats remain page-scoped; completed counts would be incomplete on every paginated page.
- **Why not chosen**: The requested behavior needs counts across the filtered result set, not only visible rows.

### Alternative B: Persist a New Completed Status

- **Approach**: Add `completed` to the persisted booking status enum and update old upcoming bookings via job or opportunistic writes.
- **Pros**: Queries become simple status counts after migration.
- **Cons**: Requires schema/migration work, introduces background job expectations, and changes mutation semantics for restore/cancel.
- **Why not chosen**: The user explicitly wants to avoid a DB scanning job, and completion is derivable from appointment time.

### Alternative C: API-Derived Statistics and Display State

- **Approach**: Keep persisted `status: upcoming | cancelled`, compute `completed` from `date + time` in the salon timezone, return aggregate stats from `GET /api/bookings`, and expose a derived display state for UI labels.
- **Pros**: Fixes stats across the full filtered dataset, avoids DB mutation jobs, keeps existing booking lifecycle storage intact, and gives UI a stable contract.
- **Cons**: Requires careful timezone handling and OpenAPI/type updates.
- **Why not chosen**: Chosen.

## Agreed Approach

Use Alternative C. `GET /api/bookings` will return `stats: { total, upcoming, cancelled, completed }` for the same non-status filters the list request is using, and each enriched booking item will expose a derived display state so admin rows can label past upcoming appointments as completed. The persisted booking `status` remains unchanged.

## Key Decisions

- Use the existing salon timezone source, `SALON_TIMEZONE` with default `America/New_York`, for all completed calculations.
- Treat `completed` as a derived presentation/reporting state, not a persisted booking status.
- Keep cancellation and restore actions scoped to persisted statuses. Completed rows should not require automatic DB updates.
- Update OpenAPI schemas/examples and generated Swagger output because the bookings list response shape changes.

## Open Questions

- None blocking. The implementation can choose the exact derived field name, but `displayStatus` is preferred because it avoids overloading persisted `status`.
