# 10 — Migration từ Mock UI

## 1. Tổng quan

UI booking + admin **đã hoàn chỉnh** trên mock. Phase backend **không redesign UI** — chỉ thay data layer.

```
BEFORE                              AFTER
──────                              ─────
useServices()                       useServices()
  └─ mockServices                     └─ GET /api/services

useSaveMockBooking()                useCreateBooking()
  └─ mutate mock array                └─ createBookingAction

isAdminMockAuthed()                 useAuthSession().role === 'admin'
  └─ sessionStorage                   └─ Auth.js JWT
```

## 2. Files cần sửa (không tạo UI mới)

### Data layer

| File                            | Thay đổi                                           |
| ------------------------------- | -------------------------------------------------- |
| `src/services/salon.service.ts` | Mock → API/actions                                 |
| `src/mocks/salon/data.ts`       | Giữ cho dev seed / Storybook; không import runtime |

### Auth

| File                                        | Thay đổi                                      |
| ------------------------------------------- | --------------------------------------------- |
| `src/libs/auth.config.ts`                   | DB lookup + bcrypt                            |
| `src/stores/booking.store.ts`               | Xóa `isAdminMockAuthed`, `setAdminMockAuthed` |
| `src/components/admin/AdminShell.tsx`       | Session gate thay mock                        |
| `src/app/admin/login/page.tsx`              | Gọi `loginAction`                             |
| `src/components/staff/StaffPortalLogin.tsx` | Credentials thay phone lookup                 |

### Types & validation

| File                                | Thay đổi                                         |
| ----------------------------------- | ------------------------------------------------ |
| `src/types/salon.type.ts`           | Align fields (visible, firstName/lastName staff) |
| `src/validations/booking.schema.ts` | `lastName` required                              |
| `src/validations/staff.schema.ts`   | Mới                                              |
| `src/types/next-auth.d.ts`          | Add `role`                                       |

### Components (minor)

| File                   | Thay đổi                                |
| ---------------------- | --------------------------------------- |
| `StaffFormModal.tsx`   | firstName/lastName + password on create |
| `ServiceFormModal.tsx` | `active` → `visible` label              |
| `CustomerStep.tsx`     | lastName required UI                    |

## 3. Field mapping mock → DB

### SalonService

| Mock          | DB/API             |
| ------------- | ------------------ |
| `id`          | `_id` stringified  |
| `categoryId`  | ObjectId string    |
| `durationMin` | `estimatedMinutes` |
| `active`      | `visible`          |

### SalonStaff → User (staff)

| Mock               | DB/API                           |
| ------------------ | -------------------------------- |
| `name`             | `firstName` + `lastName`         |
| `active`           | `visible`                        |
| `role` (job title) | drop hoặc `specialties`          |
| —                  | `email` + `passwordHash` (login) |

### SalonBooking

| Mock                       | DB/API                                    |
| -------------------------- | ----------------------------------------- |
| `staffId: 'any'`           | `staffPreference: 'any'`, `staffId: null` |
| `serviceId` + `serviceIds` | `serviceIds[]` only                       |
| `status: completed`        | remove phase 1                            |
| `createdAt?`               | `createdAt` required                      |

## 4. Seed data strategy

Script `scripts/seed-salon.ts` (hoặc action one-time):

1. Admin user từ env
2. `SalonSettings` default
3. Optional: import `mockServices`, `mockStaff` → DB cho demo

Chạy: `pnpm seed` (thêm script).

## 5. Feature parity checklist

| Feature                 | Mock         | Backend done when         |
| ----------------------- | ------------ | ------------------------- |
| Public booking wizard   | ✓ UI         | create + slots API works  |
| Confirmation page       | ✓ UI         | by-reference GET works    |
| Admin services CRUD     | ✓ UI         | actions + API             |
| Admin staff CRUD        | ✓ UI         | actions + password create |
| Schedule settings       | ✓ UI         | singleton persist         |
| Admin bookings list     | ✓ UI         | GET + filters             |
| Cancel / restore        | ✓ UI         | toggle actions            |
| Admin new booking modal | ✓ UI         | reuse createBookingAction |
| Staff calendar          | ✓ UI         | staff bookings GET        |
| Staff portal login      | mock phone   | Auth.js staff role        |
| Dashboard KPIs          | partial mock | KPI API or client calc    |

## 6. Rollout plan

```
Phase A — Foundation
  models, auth, middleware, seed admin

Phase B — Catalog
  services, categories, staff CRUD

Phase C — Scheduling
  settings persist, slots API

Phase D — Bookings
  create, list, cancel/restore

Phase E — Cleanup
  remove mock auth, delete mock hooks, update docs
```

Có thể gộp vào một OpenSpec change `salon-platform-backend` với tasks theo phases.

## 7. Breaking changes — FE follow BE (planned)

Khi wire API, FE **bắt buộc** align theo [00-naming-conventions.md](./00-naming-conventions.md):

1. `SalonStaff.name` → `firstName` + `lastName`
2. `active` → `visible`
3. `durationMin` → `estimatedMinutes`
4. `staffId: 'any'` → `staffPreference` + `staffId`
5. `serviceId` → `serviceIds[]`
6. Admin login cần Mongo + seed (không còn mock instant)
7. TanStack Query có latency thật — loading/error states

**Không** tạo mapper alias phía server để trì hoãn FE refactor.

## 8. Files giữ nguyên (reuse)

- `src/utils/schedule.util.ts` — core slot logic
- `src/utils/staff-calendar.util.ts` — calendar events
- `src/components/booking/*` — wizard steps
- `src/components/admin/**` — admin UI
- `src/stores/booking.store.ts` — wizard state (trừ mock auth)
