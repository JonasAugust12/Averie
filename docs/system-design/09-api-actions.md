# 09 — API & Server Actions

## 1. Tổng hợp endpoints

### Public GET (Route Handlers)

| Method | Path                         | Mô tả                                                                         |
| ------ | ---------------------------- | ----------------------------------------------------------------------------- |
| GET    | `/api/service-categories`    | Categories + services                                                         |
| GET    | `/api/services`              | Services list                                                                 |
| GET    | `/api/staff`                 | Staff list (`?visible=true`)                                                  |
| GET    | `/api/settings/schedule`     | Schedule settings                                                             |
| GET    | `/api/bookings/slots`        | Available slots (`date`, `serviceIds`, optional `staffPreference`, `staffId`) |
| GET    | `/api/bookings/by-reference` | Confirmation lookup                                                           |
| GET    | `/api/health`                | Health (existing)                                                             |

### Admin GET

| Method | Path                      | Mô tả                                                       |
| ------ | ------------------------- | ----------------------------------------------------------- |
| GET    | `/api/bookings`           | Paginated list + filters                                    |
| GET    | `/api/bookings/:id`       | Detail                                                      |
| GET    | `/api/staff/:id/bookings` | Staff calendar data                                         |
| GET    | `/api/admin/kpis`         | Dashboard metrics (`?period=today\|week\|month\|year\|all`) |

### Server Actions (mutations)

File naming: `src/actions/<domain>.action.ts`

| Action                                                                                               | Domain          |
| ---------------------------------------------------------------------------------------------------- | --------------- |
| `loginAction`, `logoutAction`                                                                        | auth (existing) |
| `createBookingAction`                                                                                | booking         |
| `cancelBookingAction`, `restoreBookingAction`                                                        | booking         |
| `createServiceCategoryAction`, `updateServiceCategoryAction`, `deleteServiceCategoryAction`          | services        |
| `createServiceAction`, `updateServiceAction`, `deleteServiceAction`, `toggleServiceVisibilityAction` | services        |
| `createStaffAction`, `updateStaffAction`, `deleteStaffAction`, `resetStaffPasswordAction`            | staff           |
| `updateScheduleSettingsAction`                                                                       | settings        |

## 2. Response envelope

Mọi handler và action:

```typescript
type ApiResponse<T> = {
    status: number;
    message: string;
    data: T | null;
};
```

HTTP Route Handler map `status` → HTTP status code.

## 3. Client layer (`@services`)

Pattern từ `todo.service.ts`:

```typescript
// GET
export function useBookings(filters) {
    return useQuery({
        queryKey: ['bookings', filters],
        queryFn: () => apiClient.get('/bookings', { params: filters }).then(unwrapApiResponse),
    });
}

// Mutation
export function useCancelBooking() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: cancelBookingAction,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['bookings'] }),
    });
}
```

Refactor `salon.service.ts`: xóa mock imports, giữ hook names nếu có thể để UI không đổi nhiều.

## 4. File structure (target)

```text
src/
  app/api/
    service-categories/route.ts
    services/route.ts
    staff/route.ts
    staff/[id]/bookings/route.ts
    settings/schedule/route.ts
    bookings/route.ts
    bookings/[id]/route.ts
    bookings/slots/route.ts
    bookings/by-reference/route.ts
    admin/kpis/route.ts
  actions/
    booking.action.ts
    service.action.ts
    service-category.action.ts
    staff.action.ts
    schedule-settings.action.ts
    auth.action.ts
  models/
    user.model.ts
    service-category.model.ts
    service.model.ts
    booking.model.ts
    salon-settings.model.ts
  validations/
    booking.schema.ts
    service.schema.ts
    staff.schema.ts
    schedule-settings.schema.ts
  libs/
    salon.mapper.ts      # _id→id, omit secrets only (see 00-naming-conventions)
    booking.service.ts      # shared server logic
    schedule.server.ts      # wrap schedule.util for server
```

## 5. Error codes

| status | Khi nào                   |
| ------ | ------------------------- |
| 200    | OK                        |
| 201    | Created                   |
| 400    | Validation fail           |
| 401    | Unauthorized              |
| 403    | Forbidden (wrong role)    |
| 404    | Not found                 |
| 409    | Slot conflict / duplicate |
| 500    | Server error              |

## 6. Pagination (bookings list)

```typescript
// GET /api/bookings?page=1&limit=20
{
  data: {
    items: SalonBooking[],
    total: number,
    page: number,
    limit: number,
  }
}
```

## 7. Implementation order (gợi ý cho tasks.md)

```
1. Models + seed admin + settings
2. Auth authorize() + middleware
3. Services + categories CRUD
4. Staff CRUD
5. Schedule settings read/write
6. Booking slots GET + create
7. Admin bookings list/cancel/restore
8. Wire salon.service.ts hooks
9. Remove mock layer + sessionStorage auth
10. type-check + lint
```

## 8. Testing strategy (phase 1)

- Unit: `schedule.util` (existing logic)
- Integration: actions với Mongo memory server (optional)
- Manual: booking wizard E2E happy path

Không bắt buộc automated E2E phase 1.

## 9. Dependencies to add

| Package           | Purpose       |
| ----------------- | ------------- |
| `bcryptjs`        | Password hash |
| `@types/bcryptjs` | Types (dev)   |

Optional: `@date-fns/tz` nếu timezone phức tạp.
