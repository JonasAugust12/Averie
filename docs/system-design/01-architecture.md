# 01 — Kiến trúc hệ thống

## 1. Tổng quan

Averie là ứng dụng **Next.js 15 App Router** full-stack, deploy **Vercel serverless**. Frontend và backend cùng codebase; không có server riêng.

```
                    ┌──────────────────────────────────┐
                    │           Vercel Edge            │
                    └──────────────────────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        ▼                           ▼                           ▼
┌───────────────┐         ┌─────────────────┐         ┌─────────────────┐
│ Public routes │         │  Admin routes   │         │  Staff routes   │
│ /book         │         │  /admin/*       │         │  /staff/*       │
│ /             │         │                 │         │                 │
└───────┬───────┘         └────────┬────────┘         └────────┬────────┘
        │                          │                           │
        └──────────────────────────┼───────────────────────────┘
                                   ▼
                    ┌──────────────────────────────┐
                    │   React 19 + TanStack Query   │
                    │   Zustand (wizard state)      │
                    │   react-hook-form + Zod       │
                    └──────────────┬───────────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              ▼                    ▼                    ▼
     ┌────────────────┐  ┌────────────────┐  ┌────────────────┐
     │ GET /api/*     │  │ Server Actions │  │ Auth.js        │
     │ Route Handlers │  │ @actions/*     │  │ /api/auth/*    │
     └────────┬───────┘  └────────┬───────┘  └────────┬───────┘
              │                   │                    │
              └───────────────────┼────────────────────┘
                                  ▼
                    ┌──────────────────────────────┐
                    │  Domain services / mappers    │
                    │  Zod validation               │
                    └──────────────┬───────────────┘
                                   ▼
                    ┌──────────────────────────────┐
                    │  Mongoose 8.x                 │
                    │  connectToDatabase() cache    │
                    └──────────────┬───────────────┘
                                   ▼
                    ┌──────────────────────────────┐
                    │  MongoDB Atlas                │
                    └──────────────────────────────┘
```

## 2. Công nghệ (từ `package.json` + quyết định thiết kế)

| Lớp             | Công nghệ                                   | Ghi chú                       |
| --------------- | ------------------------------------------- | ----------------------------- |
| Runtime         | Node 24.x                                   | `engines` trong package.json  |
| Framework       | Next.js 15.5                                | App Router                    |
| UI              | React 19, Tailwind 4, Lucide, Framer Motion | Theme warm neutrals           |
| Client data     | TanStack Query 5, Axios, Zustand            | `@services/*`                 |
| Form / validate | react-hook-form, **Zod 4**                  | Schema dùng chung FE + server |
| i18n            | next-intl                                   | `vi` / `en`                   |
| Calendar UI     | FullCalendar 6                              | Admin schedule views          |
| **Database**    | **MongoDB Atlas + Mongoose 8**              | Không dùng TypeORM            |
| Auth            | **Auth.js (next-auth v5 beta)**             | JWT + Credentials             |
| Password        | bcrypt (thêm dependency)                    | Hash server-side only         |

### Quyết định: Mongoose thay vì TypeORM

Yêu cầu ban đầu đề cập TypeORM. Thiết kế chọn **Mongoose** vì:

1. Repo đã cài `mongoose@^8.19.1` và có pattern `connectToDatabase()` + `Todo` model.
2. `openspec/config.yaml` và `docs/overview.md` ghi rõ MongoDB + Mongoose.
3. Mongoose là ODM chính thống cho MongoDB trên Node; TypeORM hỗ trợ MongoDB nhưng ít mature hơn cho document model.
4. UI/types hiện tại (`SalonService`, `SalonBooking`, …) map tự nhiên sang Mongoose schemas.

Nếu sau này cần SQL, TypeORM có thể xem xét riêng — **không áp dụng phase 1**.

## 3. Schema-first naming (strict)

Xem chi tiết: [00-naming-conventions.md](./00-naming-conventions.md).

- **BE đặt tên trước** — Mongoose + Zod + API DTO dùng cùng một bộ field/collection.
- **FE follow sau** — mock UI (`active`, `durationMin`, `SalonStaff.name`, …) sẽ refactor theo BE; không yêu cầu BE compat ngược.
- **Mapper server** chỉ serialize (`_id` → `id`, ẩn `passwordHash`) — **không** alias field nghiệp vụ.

## 4. Backend rules (bắt buộc)

| Thao tác                        | Cơ chế        | Vị trí                           |
| ------------------------------- | ------------- | -------------------------------- |
| **GET** (đọc)                   | Route Handler | `src/app/api/**/route.ts`        |
| **POST / PUT / PATCH / DELETE** | Server Action | `src/actions/*.action.ts`        |
| Auth HTTP protocol              | Route Handler | `src/app/api/auth/[...nextauth]` |
| Login / logout UI               | Server Action | `src/actions/auth.action.ts`     |

Response envelope thống nhất:

```json
{ "status": 200, "message": "OK", "data": {} }
```

Helpers: `apiSuccess` / `apiError` (API), `apiSuccessResult` / `apiErrorResult` (actions), `unwrapApiResponse` (client).

## 5. Phân vùng route

| Vùng      | Path prefix                   | Auth          | Mô tả            |
| --------- | ----------------------------- | ------------- | ---------------- |
| Marketing | `/`                           | Public        | Landing          |
| Booking   | `/book`, `/book/confirmation` | Public        | Wizard đặt lịch  |
| Admin     | `/admin/*`                    | Admin session | Quản trị salon   |
| Staff     | `/staff/*`                    | Staff session | Portal nhân viên |
| API       | `/api/*`                      | Tùy endpoint  | Reads + Auth.js  |

Middleware Next.js sẽ bảo vệ `/admin/*` (trừ login) và `/staff/*` sau khi auth nối DB.

## 6. Layering code

```text
src/
  validations/     ← Zod schemas (single source of truth)
  models/          ← Mongoose schemas
  libs/            ← mappers, auth, mongodb, action.util
  actions/         ← mutations (Server Actions)
  app/api/         ← GET Route Handlers
  services/        ← TanStack Query hooks (client)
  components/      ← UI (đã có, giữ nguyên)
  types/           ← TS types (DTO / view models)
  utils/           ← schedule.util, staff-calendar.util (giữ logic)
```

**Nguyên tắc:** business logic nặng (slot availability, conflict check) nằm ở server (shared util gọi từ actions/API), không chỉ client mock.

## 7. Deployment & env

**Vercel (mặc định):** serverless — biến môi trường theo [`.env.example`](../../.env.example).

**Bizfly Cloud (self-hosted):** một server, image từ GitHub Actions, Ansible cấu hình host.
Log và debug: [README — Bizfly logs](../../README.md#bizfly-logs--debugging),
[deployment-bizfly.md](../deployment-bizfly.md).

```env
MONGODB_URI=mongodb+srv://.../averie?...   # bắt buộc có /averie
AUTH_SECRET=...              # hoặc NEXTAUTH_SECRET
AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

- `MONGODB_URI` chỉ server — không `NEXT_PUBLIC_`.
- Connection cache trên `globalThis` (pattern hiện có trong `mongodb.ts`).

## 8. Non-goals (phase 1)

- Payment gateway
- Email/SMS notifications
- OAuth providers
- Per-staff shift scheduling (chỉ salon-level schedule)
- Customer accounts linked to bookings
- Real-time websocket updates
