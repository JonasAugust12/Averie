## 1. API Contract And Derived State

- [x] 1.1 [api] Add shared TypeScript types for booking display state and booking list stats.
- [x] 1.2 [api] Add or extend a timezone-safe utility that derives completed state from booking `date`, `time`, and persisted status using salon timezone rules.
- [x] 1.3 [api] Update booking serialization/enrichment so booking list DTOs expose the chosen derived display state without changing persisted `status`.
- [x] 1.4 [api] Update `GET /api/bookings` to return `stats: { total, upcoming, cancelled, completed }` for the full filtered result set, independent of page offset and limit.
- [x] 1.5 [api] Preserve existing authenticated envelope behavior and error handling for `/api/bookings`.

## 2. Admin Bookings UI

- [x] 2.1 [ui] Replace page-local stats calculation in `/admin/bookings` with `data.stats` from the API.
- [x] 2.2 [ui] Add completed statistic display and status tab/count support in admin booking filters/cards.
- [x] 2.3 [ui] Update booking status badges and row/mobile rendering to show completed for past upcoming appointments.
- [x] 2.4 [ui] Ensure cancel/restore buttons still operate only on valid persisted statuses and do not require completed DB mutation.
- [x] 2.5 [ui] Add English and Vietnamese admin translations for the completed label/stat.

## 3. API Documentation And Verification

- [x] 3.1 [api] Update OpenAPI booking schemas to include booking display state and list stats.
- [x] 3.2 [api] Update OpenAPI examples and response example mapping for `GET /api/bookings`.
- [x] 3.3 [api] Regenerate Swagger output with `pnpm openapi:gen`.
- [x] 3.4 [api] Run `pnpm type-check`.
- [x] 3.5 [ui] Run `pnpm lint` if implementation touches lint-sensitive UI formatting.
