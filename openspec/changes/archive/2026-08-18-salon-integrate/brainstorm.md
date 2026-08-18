## Design Summary

Wire Averie's existing salon UI (built on mocks) to the completed backend (Route Handlers + Server Actions + Auth.js). Replace `salon.service.ts` mock hooks with TanStack Query + `apiClient` (GET) and Server Actions (mutations). Enrich booking list/detail APIs via **lookup map** (load staff + services once, join in handler — no MongoDB populate per row). Admin bookings use **server-side pagination/filter** (`page`, `limit`, `status`, `date`, `search`). Forms use react-hook-form + Zod; BE errors surface via react-toastify. Data-fetching views show domain skeletons. No client-side DTO mappers — components consume API field names directly (`visible`, `estimatedMinutes`, `firstName`/`lastName`, `staffPreference`). Auth stays Auth.js httpOnly cookie — **no** Zustand token store.

## Alternatives Considered

### Alternative A: MongoDB populate on booking queries

- **Approach**: `.populate('staffId').populate('serviceIds')` on each booking find
- **Pros**: Simple handler code; Mongoose handles joins
- **Cons**: N+1 / heavy joins as bookings grow; harder to control response shape
- **Why not chosen**: Booking volume will exceed staff/service catalog size; populate scales poorly on paginated lists

### Alternative B: Lookup map enrichment (Agreed)

- **Approach**: Query bookings → collect unique `staffId` + `serviceIds` → load staff/services in 1–2 queries → attach summaries in mapper
- **Pros**: Fixed small number of extra queries regardless of page size; predictable DTO; easy to cache staff/service maps later
- **Cons**: Slightly more handler code than populate
- **Why chosen**: User preference + system-design scale assumption (many bookings, few staff/services)

### Alternative C: Client-side join (keep separate GETs)

- **Approach**: FE fetches bookings + services + staff, joins in page (current mock pattern)
- **Pros**: No BE changes
- **Cons**: Extra client complexity; multiple round-trips; violates "no client mapping" goal; admin list needs 3 hooks per page
- **Why not chosen**: Explicit user request to enrich BE and avoid client mapping

### Alternative D: Client-side pagination (mock pattern)

- **Approach**: Fetch all bookings once, filter/paginate in React
- **Pros**: Simple FE; works for tiny datasets
- **Cons**: Breaks at scale; ignores existing API query params
- **Why not chosen**: User chose server pagination (Option A)

## Agreed Approach

**Alternative B + server pagination + phased integration** (Foundation → Customer → Admin catalog → Admin bookings → Staff portal). Shared infra first (toast, error helper, type alignment, domain `@services/*` modules, skeleton components). BE adds `staff` and `services` summary arrays on booking DTOs wherever list/detail UI needs display names. Destructive actions use existing `useUIStore.showConfirm()`.

## Key Decisions

| Decision                   | Choice                                                              |
| -------------------------- | ------------------------------------------------------------------- |
| Booking enrichment         | Lookup map in shared server helper `@libs/booking-enrich.server.ts` |
| Admin bookings pagination  | Server-side via `GET /api/bookings` query params                    |
| Auth session               | Auth.js JWT cookie only — no Zustand auth store                     |
| Client data layer          | `@services/*` (not `@hooks/apis`) following `todo.service.ts`       |
| Forms                      | react-hook-form + `@validations/*` Zod schemas                      |
| Errors                     | `react-toastify` + `toastApiError()` on mutation/query errors       |
| Types                      | Deprecate mock `salon.type.ts`; use `@typings/salon/*.type.ts` DTOs |
| Loading UX                 | Per-domain skeleton components when `isLoading` from useQuery       |
| `completed` booking status | Remove from UI — BE only `upcoming \| cancelled`                    |
| Confirm destructive ops    | `useUIStore.showConfirm()` (GlobalConfirmPopup already mounted)     |

## Open Questions

- None blocking — server pagination and lookup map confirmed by user.
