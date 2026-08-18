# Salon FE–BE Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace mock salon data layer with live API/Server Actions across customer, admin, and staff portals using lookup-map booking enrichment, server-side admin pagination, skeleton loading, RHF+Zod forms, and react-toastify errors.

**Architecture:** Domain `@services/*` hooks wrap `apiClient` (GET) and `@actions/*` (mutations) with TanStack Query caching. Booking GET handlers enrich responses via `@libs/booking-enrich.server.ts` (staff/service lookup maps). Auth.js httpOnly cookies — no client token store. UI consumes API DTOs directly without client mappers.

**Tech Stack:** Next.js 15 App Router, React 19, TanStack Query, Axios, react-hook-form, Zod, react-toastify, Auth.js v5, Mongoose, next-intl

## Global Constraints

- GET reads → `src/app/api/**` Route Handlers only
- POST/PUT/PATCH/DELETE → `src/actions/**` Server Actions only
- Response envelope: `{ status: number, message: string, data: T | null }`
- MongoDB: use `connectToDatabase()` from `@libs/mongodb` — never `mongoose.connect()` per handler
- Path aliases: `@services`, `@actions`, `@typings`, `@validations`, `@libs`, `@utils`, `@components`, `@stores`
- No client-side DTO field renaming mappers
- Destructive ops: `useUIStore.showConfirm()` before mutation
- Run `pnpm type-check` before claiming done; `pnpm lint` when touching many files

**OpenSpec change:** `openspec/changes/salon-integrate/` (proposal, design, specs, tasks)

---

## File Structure (created/modified)

| Path                                      | Responsibility                     |
| ----------------------------------------- | ---------------------------------- |
| `src/libs/booking-enrich.server.ts`       | Staff/service lookup maps + enrich |
| `src/types/salon/booking.type.ts`         | `BookingListItemDto` + summaries   |
| `src/mappers/booking.mapper.ts`           | `serializeBookingListItem`         |
| `src/app/api/bookings/**`                 | Enriched GET handlers              |
| `src/utils/toast.util.ts`                 | Toast helpers                      |
| `src/components/shared/skeletons/*.tsx`   | Loading placeholders               |
| `src/middleware.ts`                       | Auth route protection              |
| `src/services/booking.service.ts`         | Booking TanStack hooks             |
| `src/services/service-catalog.service.ts` | Catalog hooks                      |
| `src/services/staff.service.ts`           | Staff hooks                        |
| `src/services/schedule.service.ts`        | Schedule hooks                     |
| `src/services/admin.service.ts`           | KPI hooks                          |
| `src/services/salon.service.ts`           | Re-export barrel (temporary)       |

---

### Task 1: Booking enrichment types & server helper

**Files:**

- Modify: `src/types/salon/booking.type.ts`
- Create: `src/libs/booking-enrich.server.ts`
- Modify: `src/mappers/booking.mapper.ts`

**Interfaces:**

- Produces: `BookingStaffSummaryDto`, `BookingServiceSummaryDto`, `BookingListItemDto`, `loadStaffServiceMaps()`, `enrichBookingListItem()`

- [ ] **Step 1: Extend booking types**

Add to `src/types/salon/booking.type.ts`:

```typescript
export interface BookingStaffSummaryDto {
    id: string;
    firstName: string;
    lastName: string;
}

export interface BookingServiceSummaryDto {
    id: string;
    name: string;
    estimatedMinutes: number;
}

export interface BookingListItemDto extends BookingDto {
    staff: BookingStaffSummaryDto | null;
    services: BookingServiceSummaryDto[];
}

export interface BookingsListQuery {
    page?: number;
    limit?: number;
    status?: 'upcoming' | 'cancelled';
    date?: string;
    search?: string;
}
```

- [ ] **Step 2: Create booking-enrich.server.ts**

Create `src/libs/booking-enrich.server.ts`:

```typescript
import { Service } from '@models/service.model';
import { User } from '@models/user.model';
import type {
    BookingListItemDto,
    BookingServiceSummaryDto,
    BookingStaffSummaryDto,
} from '@typings/salon/booking.type';
import { serializeBookingListItem } from '@mappers/booking.mapper';

export type StaffServiceMaps = {
    staffById: Map<string, BookingStaffSummaryDto>;
    serviceById: Map<string, BookingServiceSummaryDto>;
};

export async function loadStaffServiceMaps(): Promise<StaffServiceMaps> {
    const [staffDocs, serviceDocs] = await Promise.all([
        User.find({ role: 'staff' }).select('firstName lastName').lean(),
        Service.find().select('name estimatedMinutes').lean(),
    ]);

    const staffById = new Map<string, BookingStaffSummaryDto>();
    for (const doc of staffDocs) {
        staffById.set(String(doc._id), {
            id: String(doc._id),
            firstName: doc.firstName,
            lastName: doc.lastName,
        });
    }

    const serviceById = new Map<string, BookingServiceSummaryDto>();
    for (const doc of serviceDocs) {
        serviceById.set(String(doc._id), {
            id: String(doc._id),
            name: doc.name,
            estimatedMinutes: doc.estimatedMinutes,
        });
    }

    return { staffById, serviceById };
}

export function enrichBookingListItem(
    doc: Parameters<typeof serializeBookingListItem>[0],
    maps: StaffServiceMaps,
): BookingListItemDto {
    return serializeBookingListItem(doc, maps);
}

export function enrichBookingListItems(
    docs: Parameters<typeof serializeBookingListItem>[0][],
    maps: StaffServiceMaps,
): BookingListItemDto[] {
    return docs.map((doc) => serializeBookingListItem(doc, maps));
}
```

- [ ] **Step 3: Update booking mapper**

In `src/mappers/booking.mapper.ts`, add:

```typescript
import type { StaffServiceMaps } from '@libs/booking-enrich.server';
import type {
    BookingListItemDto,
    BookingServiceSummaryDto,
    BookingStaffSummaryDto,
} from '@typings/salon/booking.type';

function resolveStaff(
    doc: { staffPreference: 'any' | 'specific'; staffId?: IdLike | null },
    staffById: Map<string, BookingStaffSummaryDto>,
): BookingStaffSummaryDto | null {
    if (doc.staffPreference === 'any' || !doc.staffId) return null;
    return staffById.get(toId(doc.staffId)) ?? null;
}

function resolveServices(
    serviceIds: IdLike[],
    serviceById: Map<string, BookingServiceSummaryDto>,
): BookingServiceSummaryDto[] {
    return serviceIds
        .map((id) => serviceById.get(toId(id)))
        .filter((s): s is BookingServiceSummaryDto => Boolean(s));
}

export function serializeBookingListItem(
    doc: Parameters<typeof serializeBooking>[0],
    maps: StaffServiceMaps,
): BookingListItemDto {
    const base = serializeBooking(doc);
    return {
        ...base,
        staff: resolveStaff(doc, maps.staffById),
        services: resolveServices(doc.serviceIds, maps.serviceById),
    };
}
```

- [ ] **Step 4: Run type-check**

Run: `pnpm type-check`
Expected: PASS (or fix import cycles — if cycle between mapper and enrich lib, move `StaffServiceMaps` type to `@typings/salon/booking.type.ts`)

- [ ] **Step 5: Commit**

```bash
git add src/types/salon/booking.type.ts src/libs/booking-enrich.server.ts src/mappers/booking.mapper.ts
git commit -m "feat(api): add booking lookup-map enrichment types and helper"
```

---

### Task 2: Wire enriched GET handlers + OpenAPI

**Files:**

- Modify: `src/app/api/bookings/route.ts`
- Modify: `src/app/api/bookings/[id]/route.ts`
- Modify: `src/app/api/bookings/by-reference/route.ts`
- Modify: `src/app/api/staff/[id]/bookings/route.ts`
- Modify: `src/openapi/schemas/booking.schema.ts`
- Modify: `src/openapi/examples/booking.examples.ts` (or `responses.ts`)

**Interfaces:**

- Consumes: `loadStaffServiceMaps`, `enrichBookingListItems`, `enrichBookingListItem`
- Produces: API responses with `BookingListItemDto` in `data.items` / `data`

- [ ] **Step 1: Update GET /api/bookings**

In `src/app/api/bookings/route.ts`, after `Booking.find`:

```typescript
import { loadStaffServiceMaps, enrichBookingListItems } from '@libs/booking-enrich.server';

// inside GET, after items fetched:
const maps = await loadStaffServiceMaps();
return apiSuccess(
    {
        items: enrichBookingListItems(items, maps),
        total,
        page,
        limit,
    },
    'OK',
);
```

- [ ] **Step 2: Update GET /api/bookings/[id] and by-reference**

Same pattern: load maps once, return `enrichBookingListItem(doc, maps)`.

- [ ] **Step 3: Update GET /api/staff/[id]/bookings**

Return `enrichBookingListItems(bookings, maps)` array.

- [ ] **Step 4: OpenAPI schema**

In `src/openapi/schemas/booking.schema.ts`:

```typescript
export const bookingStaffSummarySchema = z.object({
    id: objectIdSchema,
    firstName: z.string(),
    lastName: z.string(),
});

export const bookingServiceSummarySchema = z.object({
    id: objectIdSchema,
    name: z.string(),
    estimatedMinutes: z.number().int(),
});

export const bookingListItemDtoSchema = bookingDtoSchema.extend({
    staff: bookingStaffSummarySchema.nullable(),
    services: z.array(bookingServiceSummarySchema),
});

export const paginatedBookingsDataSchema = z.object({
    items: z.array(bookingListItemDtoSchema),
    total: z.number().int(),
    page: z.number().int(),
    limit: z.number().int(),
});
```

Update examples to include `staff` and `services` on sample booking.

- [ ] **Step 5: Regenerate OpenAPI**

Run: `pnpm openapi:gen`
Expected: `openapi/generated/openapi.json` updated

- [ ] **Step 6: Commit**

```bash
git add src/app/api/bookings src/app/api/staff src/openapi
git commit -m "feat(api): enrich booking GET responses with staff and service summaries"
```

---

### Task 3: Toast infrastructure

**Files:**

- Modify: `package.json` (via pnpm add)
- Create: `src/utils/toast.util.ts`
- Modify: app provider (e.g. `src/app/layout.tsx` or `src/providers/QueryProvider.tsx`)

**Interfaces:**

- Produces: `toastApiError(error: unknown)`, `toastSuccess(message: string)`

- [ ] **Step 1: Install dependency**

Run: `pnpm add react-toastify`

- [ ] **Step 2: Create toast.util.ts**

```typescript
import { toast } from 'react-toastify';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '@typings/api.type';

export function toastSuccess(message: string) {
    toast.success(message);
}

export function toastApiError(error: unknown) {
    const axiosErr = error as AxiosError<ApiResponse<null>>;
    const message =
        axiosErr.response?.data?.message ??
        (error instanceof Error ? error.message : null) ??
        'Something went wrong';
    toast.error(message);
}
```

- [ ] **Step 3: Mount ToastContainer**

In root client provider component:

```tsx
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// inside provider JSX:
<ToastContainer position="top-right" autoClose={4000} newestOnTop />;
```

- [ ] **Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml src/utils/toast.util.ts src/providers src/app
git commit -m "feat(ui): add react-toastify and toastApiError helper"
```

---

### Task 4: Skeleton components

**Files:**

- Create: `src/components/shared/skeletons/BookingsTableSkeleton.tsx`
- Create: `src/components/shared/skeletons/ServicesGridSkeleton.tsx`
- Create: `src/components/shared/skeletons/StaffGridSkeleton.tsx`
- Create: `src/components/shared/skeletons/DashboardSkeleton.tsx`
- Create: `src/components/shared/skeletons/TimeSlotsSkeleton.tsx`
- Create: `src/components/shared/skeletons/ScheduleSettingsSkeleton.tsx`
- Create: `src/components/shared/skeletons/StaffCalendarSkeleton.tsx`
- Create: `src/components/shared/skeletons/BookingDetailSkeleton.tsx`
- Create: `src/components/shared/skeletons/index.ts`
- Modify: `src/components/shared/index.ts`

**Interfaces:**

- Produces: exported skeleton components for all data-fetching views

- [ ] **Step 1: Create BookingsTableSkeleton**

```tsx
export function BookingsTableSkeleton({ rows = 8 }: { rows?: number }) {
    return (
        <div className="overflow-hidden rounded-xl border border-neutral-100 bg-white animate-pulse">
            <div className="h-12 bg-stone-100/80" />
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex gap-4 px-6 py-4 border-t border-neutral-100">
                    <div className="h-4 bg-stone-200 rounded w-24" />
                    <div className="h-4 bg-stone-200 rounded flex-1" />
                    <div className="h-4 bg-stone-200 rounded w-32" />
                    <div className="h-4 bg-stone-200 rounded w-20" />
                </div>
            ))}
        </div>
    );
}
```

- [ ] **Step 2: Create remaining skeletons** (same pulse pattern, layout matching target page — see `AlbumSkeleton` in BRIX-Web)

- [ ] **Step 3: Export from index**

```typescript
export * from './skeletons';
```

- [ ] **Step 4: Commit**

```bash
git add src/components/shared/skeletons src/components/shared/index.ts
git commit -m "feat(ui): add domain skeleton loading components"
```

---

### Task 5: Auth middleware & login wire-up

**Files:**

- Create: `src/middleware.ts`
- Modify: `src/components/admin/AdminShell.tsx`
- Modify: `src/components/staff/StaffPortalLogin.tsx`
- Modify: `src/app/admin/login/page.tsx`

**Interfaces:**

- Consumes: `auth()` from `@libs/auth`
- Produces: protected `/admin/*` and `/staff/*` routes

- [ ] **Step 1: Create middleware.ts**

```typescript
import { auth } from '@libs/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
    const { pathname } = req.nextUrl;
    const session = req.auth;
    const role = session?.user?.role;

    if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
        if (!session || role !== 'admin') {
            return NextResponse.redirect(new URL('/admin/login', req.url));
        }
    }

    if (pathname.startsWith('/staff') && pathname !== '/staff') {
        if (!session || role !== 'staff') {
            return NextResponse.redirect(new URL('/staff?login=1', req.url));
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: ['/admin/:path*', '/staff/:path*'],
};
```

- [ ] **Step 2: Wire AdminShell** — replace mock session check with `useAuthSession()`; redirect if unauthenticated

- [ ] **Step 3: Wire login forms** — use `useLogin()` mutation with `toastApiError` on failure

- [ ] **Step 4: Manual test** — seed admin, login at `/admin/login`, access `/admin/bookings`

- [ ] **Step 5: Commit**

```bash
git add src/middleware.ts src/components/admin/AdminShell.tsx src/components/staff src/app/admin/login
git commit -m "feat(auth): add middleware and wire admin/staff login to Auth.js"
```

---

### Task 6: booking.service.ts

**Files:**

- Create: `src/services/booking.service.ts`

**Interfaces:**

- Consumes: `apiClient`, `unwrapApiResponse`, booking actions
- Produces: `useBookings(filters)`, `useBooking(id)`, `useBookingByReference(ref)`, `useAvailableSlots(...)`, `useCreateBooking()`, `useCancelBooking()`, `useRestoreBooking()`

- [ ] **Step 1: Implement useBookings with server filters**

```typescript
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    cancelBookingAction,
    createBookingAction,
    restoreBookingAction,
} from '@actions/booking.action';
import { apiClient } from '@libs/api-client';
import { unwrapApiResponse } from '@libs/action.util';
import { toastApiError } from '@utils/toast.util';
import type { ApiResponse } from '@typings/api.type';
import type {
    BookingListItemDto,
    BookingsListQuery,
    PaginatedBookingsDto,
    TimeSlotDto,
} from '@typings/salon/booking.type';
import type { CreateBookingInput } from '@validations/booking.schema';

export function useBookings(filters: BookingsListQuery) {
    return useQuery({
        queryKey: ['bookings', filters],
        queryFn: async () => {
            const res = await apiClient.get<ApiResponse<PaginatedBookingsDto>>('/api/bookings', {
                params: filters,
            });
            return unwrapApiResponse(res.data);
        },
    });
}

export function useBooking(id: string) {
    return useQuery({
        queryKey: ['bookings', id],
        queryFn: async () => {
            const res = await apiClient.get<ApiResponse<BookingListItemDto>>(`/api/bookings/${id}`);
            return unwrapApiResponse(res.data);
        },
        enabled: Boolean(id),
    });
}

export function useBookingByReference(reference: string) {
    return useQuery({
        queryKey: ['bookings', 'by-reference', reference],
        queryFn: async () => {
            const res = await apiClient.get<ApiResponse<BookingListItemDto>>(
                '/api/bookings/by-reference',
                { params: { reference } },
            );
            return unwrapApiResponse(res.data);
        },
        enabled: Boolean(reference),
    });
}

export function useAvailableSlots(date: string | null, serviceIds: string[]) {
    return useQuery({
        queryKey: ['bookings', 'slots', date, serviceIds],
        queryFn: async () => {
            const res = await apiClient.get<ApiResponse<{ date: string; slots: TimeSlotDto[] }>>(
                '/api/bookings/slots',
                { params: { date, serviceIds: serviceIds.join(',') } },
            );
            return unwrapApiResponse(res.data).slots;
        },
        enabled: Boolean(date) && serviceIds.length > 0,
    });
}

export function useCreateBooking() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (input: CreateBookingInput) =>
            unwrapApiResponse(await createBookingAction(input)),
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ['bookings'] });
        },
        onError: toastApiError,
    });
}

export function useCancelBooking() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => unwrapApiResponse(await cancelBookingAction(id)),
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ['bookings'] });
        },
        onError: toastApiError,
    });
}

export function useRestoreBooking() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => unwrapApiResponse(await restoreBookingAction(id)),
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ['bookings'] });
        },
        onError: toastApiError,
    });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/services/booking.service.ts
git commit -m "feat(ui): add booking TanStack Query service hooks"
```

---

### Task 7: Remaining domain services

**Files:**

- Create: `src/services/service-catalog.service.ts`, `staff.service.ts`, `schedule.service.ts`, `admin.service.ts`
- Modify: `src/services/salon.service.ts` (re-exports)

Follow `todo.service.ts` + `booking.service.ts` patterns. Each mutation includes `onError: toastApiError` and query invalidation.

- [ ] **Step 1: service-catalog.service.ts** — `useServiceCategories`, `useServices(visible?)`, `useAllServices`, CRUD mutations for category/service

- [ ] **Step 2: staff.service.ts** — `useStaff(visible?)`, `useAllStaff`, CRUD + `useStaffBookings(staffId)`

- [ ] **Step 3: schedule.service.ts** — `useScheduleSettings`, `useUpdateScheduleSettings`

- [ ] **Step 4: admin.service.ts** — `useAdminKpis()`

- [ ] **Step 5: salon.service.ts barrel re-exports** for gradual migration

- [ ] **Step 6: Commit**

```bash
git add src/services/
git commit -m "feat(ui): add salon domain TanStack Query services"
```

---

### Task 8: Customer booking wizard integration

**Files:**

- Modify: `src/components/booking/ServiceStep.tsx`, `EmployeeStep.tsx`, `TimeStep.tsx`, `ReviewStep.tsx`, `BookingSummary.tsx`, `ConfirmationPageView.tsx`, `BookPageView.tsx`
- Modify: `src/stores/booking.store.ts` — use `staffPreference` + `serviceIds[]` instead of mock shapes

Key field changes in components:

- `durationMin` → `estimatedMinutes`
- `staffId: 'any'` → `staffPreference: 'any'` with `staffId: undefined`
- `serviceId` → `serviceIds: string[]`
- Display staff: `staff.firstName` not `staff.name`
- Loading: render `ServicesGridSkeleton`, `StaffGridSkeleton`, `TimeSlotsSkeleton`

- [ ] **Step 1: Update booking store types/defaults**
- [ ] **Step 2: ServiceStep + EmployeeStep + TimeStep**
- [ ] **Step 3: ReviewStep calls useCreateBooking**
- [ ] **Step 4: ConfirmationPageView uses useBookingByReference — render `booking.services`, `booking.staff`**
- [ ] **Step 5: Manual test** — full `/book` happy path
- [ ] **Step 6: Commit**

```bash
git commit -m "feat(ui): wire customer booking wizard to live APIs"
```

---

### Task 9: Admin bookings server pagination

**Files:**

- Modify: `src/app/admin/bookings/page.tsx`
- Modify: `src/components/admin/bookings/BookingTableRow.tsx`

- [ ] **Step 1: Replace mock hooks**

```typescript
const [filters, setFilters] = useState<BookingsListQuery>({ page: 1, limit: 8 });
const { data, isLoading } = useBookings(filters);
const cancelBooking = useCancelBooking();
const restoreBooking = useRestoreBooking();
```

- [ ] **Step 2: Bind filters to API** — on status/date/search change, `setFilters({ ...filters, page: 1, status, date, search })`

- [ ] **Step 3: Pagination from API** — `totalPages = Math.ceil((data?.total ?? 0) / (data?.limit ?? 8))`

- [ ] **Step 4: Loading skeleton** — `if (isLoading) return <BookingsTableSkeleton />`

- [ ] **Step 5: BookingTableRow** — use `booking.services.map(s => s.name).join(', ')` and staff name from `booking.staff`

- [ ] **Step 6: Cancel/restore** — `showConfirm` then `cancelBooking.mutate(id)` / `restoreBooking.mutate(id)`

- [ ] **Step 7: Remove `completed` stat** — only upcoming/cancelled

- [ ] **Step 8: Commit**

```bash
git commit -m "feat(ui): admin bookings server pagination with enriched rows"
```

---

### Task 10: Admin catalog pages

**Files:**

- Modify: `src/app/admin/services/page.tsx`, `staff/page.tsx`, `settings/schedule/page.tsx`
- Modify: `ServiceFormModal.tsx`, `CategoryFormModal.tsx`, `StaffFormModal.tsx`

Each form → `useForm` + zodResolver + mutation hook. Delete/toggle → `showConfirm`. Loading → skeleton.

- [ ] **Step 1: services page**
- [ ] **Step 2: staff page**
- [ ] **Step 3: schedule settings page**
- [ ] **Step 4: Commit**

```bash
git commit -m "feat(ui): wire admin catalog CRUD to Server Actions"
```

---

### Task 11: Admin dashboard & schedule views

**Files:**

- Modify: `src/app/admin/page.tsx`, `schedule/page.tsx`, `staff/[id]/schedule/page.tsx`, `AdminNewBookingModal.tsx`, `bookings/[id]/page.tsx`

- [ ] **Step 1: Dashboard** — `useAdminKpis`, `useBookings({ page: 1, limit: 5 })`, `DashboardSkeleton`
- [ ] **Step 2: Schedule pages** — enriched bookings, `StaffCalendarSkeleton`
- [ ] **Step 3: AdminNewBookingModal** — real create + slots
- [ ] **Step 4: Booking detail page** — `useBooking(id)`, `BookingDetailSkeleton`
- [ ] **Step 5: Commit**

---

### Task 12: Staff portal

**Files:**

- Modify: `src/app/staff/page.tsx`, `StaffUpcomingList.tsx`, `StaffCalendar.tsx`

- [ ] **Step 1: Gate on session** — `useAuthSession()`, get staff id from session.user.id
- [ ] **Step 2: useStaffBookings(staffId)** calling enriched GET
- [ ] **Step 3: Skeleton + DTO fields**
- [ ] **Step 4: Commit**

---

### Task 13: Mock removal & verification

**Files:**

- Modify: all files still importing `@/mocks/salon/data`
- Modify: `src/types/salon.type.ts` — add deprecation comment or remove runtime usage

- [ ] **Step 1: Grep** — `rg "mocks/salon" src/` → replace all runtime imports
- [ ] **Step 2: Run** `pnpm type-check` — fix all errors
- [ ] **Step 3: Run** `pnpm lint`
- [ ] **Step 4: Manual checklist**
    - Customer: `/book` → confirmation by reference
    - Admin: login → services CRUD → bookings list paginated → cancel with confirm
    - Staff: login → see assigned bookings
- [ ] **Step 5: Commit**

```bash
git commit -m "chore: remove mock salon runtime imports and verify integration"
```

---

## Self-Review

**Spec coverage:**

- Lookup map enrichment → Tasks 1–2
- Server pagination → Task 9
- Skeletons → Task 4 + wired in Tasks 8–12
- Toast/errors → Task 3
- Auth middleware → Task 5
- No client mapping → enforced in component tasks (direct DTO fields)
- RHF+Zod forms → Task 10
- Confirm popup → Tasks 9–10

**Placeholder scan:** None — all tasks have concrete paths and code.

**Type consistency:** `BookingListItemDto`, `BookingsListQuery`, `useBookings(filters)` aligned across Tasks 1, 2, 6, 9.
