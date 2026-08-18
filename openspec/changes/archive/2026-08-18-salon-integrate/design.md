## Context

Averie salon platform phase 1 backend is implemented: Mongoose models, GET Route Handlers, Server Actions, Auth.js Credentials, OpenAPI docs. UI (customer booking wizard, admin portal, staff portal) was built against `@/mocks/salon/data` via `src/services/salon.service.ts`. Field names in mock types (`active`, `durationMin`, `SalonStaff.name`, `staffId: 'any'`) diverge from canonical BE DTOs documented in `docs/system-design/00-naming-conventions.md`.

Reference patterns: `src/services/todo.service.ts` (client layer), `src/libs/mongodb.ts` (connection cache), BRIX-Web `api-client.ts` / `query-client.ts` (TanStack defaults — without Bearer token interceptors).

## Goals / Non-Goals

**Goals:**

- Replace runtime mock imports with real API/actions across customer, admin, and staff surfaces
- Enrich booking GET responses with embedded `staff` and `services` summaries via lookup map
- Admin bookings list/detail use server pagination and filters
- Add skeleton loading for every view that fetches remote data
- Standardize form validation (RHF + Zod) and error toasts (react-toastify)
- Wire Auth.js login/logout + middleware; remove mock sessionStorage admin gate
- Update OpenAPI schemas/examples for enriched booking DTOs

**Non-Goals:**

- OAuth / social login
- Customer account system (booking without login stays)
- Zustand auth/token store
- Client-side DTO mapping layers or alias fields on server
- Automated E2E test suite (manual happy-path only)
- Redesign Stitch UI layouts

## Decisions

### 1. Lookup map enrichment (bookings)

Create `@libs/booking-enrich.server.ts`:

```text
loadStaffServiceMaps() → { staffById, serviceById }
enrichBooking(doc, maps) → BookingListItemDto
enrichBookings(docs, maps) → BookingListItemDto[]
```

Used by: `GET /api/bookings`, `GET /api/bookings/[id]`, `GET /api/bookings/by-reference`, `GET /api/staff/[id]/bookings`.

Extended DTO (`@typings/salon/booking.type.ts`):

```typescript
interface BookingStaffSummaryDto {
    id: string;
    firstName: string;
    lastName: string;
}
interface BookingServiceSummaryDto {
    id: string;
    name: string;
    estimatedMinutes: number;
}
interface BookingListItemDto extends BookingDto {
    staff: BookingStaffSummaryDto | null; // null when staffPreference === 'any'
    services: BookingServiceSummaryDto[];
}
```

`staffById` loaded once via `User.find({ role: 'staff' }).select('firstName lastName').lean()` — small catalog. `serviceById` via `Service.find().select('name estimatedMinutes').lean()`.

### 2. Server-side admin bookings

`useBookings(filters)` passes `{ page, limit, status, date, search }` to `GET /api/bookings`. Page component drops client-side `useMemo` filter/pagination; `usePagination` drives `page`/`limit` query params. Stats cards may use separate `GET /api/admin/kpis` or aggregate from current filter — prefer KPI endpoint when available.

### 3. Client services layout

Split `salon.service.ts` into domain modules (keep re-exports during migration):

| File                                      | Responsibility                                     |
| ----------------------------------------- | -------------------------------------------------- |
| `src/services/booking.service.ts`         | Bookings queries + cancel/restore/create mutations |
| `src/services/service-catalog.service.ts` | Categories, services CRUD hooks                    |
| `src/services/staff.service.ts`           | Staff CRUD + staff calendar GET                    |
| `src/services/schedule.service.ts`        | Schedule settings read/update + slots              |
| `src/services/admin.service.ts`           | KPIs                                               |
| `src/services/salon.service.ts`           | Thin re-export barrel (deprecated, remove at end)  |

### 4. Error and toast infrastructure

- Add `react-toastify` + `ToastContainer` in root providers
- `@utils/toast.util.ts`: `toastApiError(error)`, `toastSuccess(message)`
- Mutations: `onError: toastApiError` in TanStack `useMutation`
- Queries: optional error boundary or `useEffect` on `isError` for critical pages

### 5. Skeleton components

Pattern from BRIX `AlbumSkeleton`: pulse placeholders matching layout grid.

| Skeleton                   | Used by                       |
| -------------------------- | ----------------------------- |
| `ServicesGridSkeleton`     | ServiceStep, admin services   |
| `StaffGridSkeleton`        | EmployeeStep, admin staff     |
| `BookingsTableSkeleton`    | admin bookings list           |
| `BookingDetailSkeleton`    | booking detail, confirmation  |
| `DashboardSkeleton`        | admin overview                |
| `ScheduleSettingsSkeleton` | schedule settings page        |
| `TimeSlotsSkeleton`        | TimeStep, admin booking modal |
| `StaffCalendarSkeleton`    | staff portal, admin schedule  |

### 6. Auth

- Add `src/middleware.ts`: protect `/admin/*` (except login) for `role: admin`; `/staff/*` for `role: staff`
- Replace mock gates in `AdminShell.tsx`, `StaffPortalLogin.tsx` with `useAuthSession()` + `loginAction`
- No token in axios — cookies sent automatically on same-origin requests

### 7. Forms migration

Admin modals (`ServiceFormModal`, `StaffFormModal`, `CategoryFormModal`, schedule settings) migrate from `useState` to `useForm` + `@validations/*` schemas. Submit calls mutation hooks; validation errors inline; BE errors via toast.

### 8. Type migration

- UI imports switch from `@typings/salon.type` mock types to `@typings/salon/*.type.ts` DTOs
- Delete or restrict `salon.type.ts` to Storybook-only re-exports if needed
- Components use API fields directly (e.g. `booking.services.map(s => s.name).join(', ')`)

## Risks / Trade-offs

| Risk                                                                   | Mitigation                                              |
| ---------------------------------------------------------------------- | ------------------------------------------------------- |
| Large UI diff from field renames                                       | Phase by portal; type-check after each phase            |
| Stale staff/service names in enriched booking if renamed after booking | Acceptable phase 1; optional future denormalization     |
| Loading flash without skeleton                                         | Require skeleton for every `isLoading` branch           |
| `completed` status removed from UI                                     | Update stats to upcoming/cancelled only; copy i18n keys |
| Missing seed data blocks manual test                                   | Document `pnpm seed` in plan verify steps               |

## Migration Plan

1. **Phase 0 — Infra**: toast, types, enrich helper, OpenAPI update, middleware, login wire
2. **Phase 1 — Customer**: catalog GET hooks, create booking, confirmation by-reference, wizard field renames
3. **Phase 2 — Admin catalog**: services/staff/schedule CRUD hooks + forms
4. **Phase 3 — Admin ops**: server-paginated bookings, cancel/restore, dashboard KPIs
5. **Phase 4 — Staff**: staff calendar GET, portal auth
6. **Phase 5 — Cleanup**: remove mock runtime imports, delete mock hooks, `pnpm type-check && pnpm lint`

Rollback: revert FE service layer; BE enrichment is backward-compatible (adds fields only).

## Open Questions

None — user confirmed lookup map and server pagination.
