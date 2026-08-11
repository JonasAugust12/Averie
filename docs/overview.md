# Averie — Tổng quan dự án

Tài liệu mô tả mục đích, công nghệ và **convention / rule** đã thống nhất khi dựng stack. Xem thêm: [Superpowers](./superpowers.md).

## 1. Mục đích

**Averie** là ứng dụng full-stack trên **Next.js App Router**, host chung FE + BE trên **Vercel** (serverless) để không phải thuê server riêng.

- **Frontend**: UI React, state, form, i18n
- **Backend**: MongoDB (Mongoose) qua Server Actions + Route Handlers
- **Auth**: Auth.js (next-auth v5) — local Credentials (stub, sẽ nối DB sau)

Mục tiêu kiến trúc: cấu trúc rõ, dễ mở rộng, chi phí host thấp.

---

## 2. Công nghệ sử dụng

| Lớp             | Công nghệ                           | Ghi chú                       |
| --------------- | ----------------------------------- | ----------------------------- |
| Framework       | Next.js 15 (App Router)             | Deploy Vercel                 |
| UI              | React 19, Tailwind CSS 4, Lucide    | Theme warm neutrals           |
| Font            | Playfair Display + Inter            | Headline / body               |
| Client data     | TanStack Query, Axios, Zustand      | Cache + HTTP + UI state       |
| Form / validate | react-hook-form, Zod                | Schema dùng chung FE + server |
| i18n            | next-intl                           | `vi` / `en`                   |
| DB              | MongoDB Atlas + Mongoose            | Connection cache (serverless) |
| Auth            | Auth.js (`next-auth` v5)            | Credentials local             |
| Tooling         | ESLint, Prettier, Husky, Commitlint | CI GitHub Actions             |
| Package manager | pnpm                                |                               |

### Alias import (tsconfig)

| Alias            | Folder                                 |
| ---------------- | -------------------------------------- |
| `@actions/*`     | `src/actions/*`                        |
| `@services/*`    | `src/services/*`                       |
| `@validations/*` | `src/validations/*`                    |
| `@components/*`  | `src/components/*`                     |
| `@hooks/*`       | `src/hooks/*`                          |
| `@i18n/*`        | `src/i18n/*`                           |
| `@libs/*`        | `src/libs/*`                           |
| `@messages/*`    | `messages/*`                           |
| `@models/*`      | `src/models/*`                         |
| `@providers/*`   | `src/providers/*`                      |
| `@stores/*`      | `src/stores/*`                         |
| `@typings/*`     | `src/types/*` (`@types` bị TS reserve) |
| `@utils/*`       | `src/utils/*`                          |
| `@/*`            | `src/*`                                |

---

## 3. Cấu trúc thư mục chính

```text
src/
  actions/                 # Server Actions — mutations
  app/
    api/                   # Route Handlers — GET + external
      _lib/http.ts         # apiSuccess / apiError
      auth/[...nextauth]/ # Auth.js endpoints (bắt buộc)
      health/
      todos/               # GET list
    layout.tsx / page.tsx
  components/
  hooks/
  i18n/
  libs/                    # auth, mongodb, api-client, action.util, …
  models/
  providers/               # Auth, Query, I18n
  services/                # TanStack hooks (client)
  stores/
  types/
  utils/
  validations/             # Zod schemas
messages/                  # next-intl JSON
docs/                      # Tài liệu dự án
```

---

## 4. Backend rules (quan trọng)

### 4.1 Khi nào dùng gì

| Thao tác                                         | Cách làm                               | Nơi đặt code                     |
| ------------------------------------------------ | -------------------------------------- | -------------------------------- |
| **GET** (đọc dữ liệu)                            | **Route Handler**                      | `src/app/api/**/route.ts`        |
| **POST / PUT / PATCH / DELETE**                  | **Server Action**                      | `src/actions/*.action.ts`        |
| External SVC, webhook, public/mobile API, stream | **Route Handler**                      | `src/app/api/*`                  |
| Auth session HTTP (Auth.js)                      | Route Handler bắt buộc                 | `src/app/api/auth/[...nextauth]` |
| Login / logout từ UI                             | Server Action bọc `signIn` / `signOut` | `src/actions/auth.action.ts`     |

**Lý do ngắn:**

- **GET → API**: dễ cache, dễ gọi từ nhiều client, URL rõ ràng, phù hợp đọc + proxy external.
- **Mutations → Server Action**: gọn với form/UI, không lộ endpoint mutate không cần thiết, validate Zod sát nghiệp vụ.

### 4.2 Luồng dữ liệu

```text
GET:
  UI → @services → Axios (apiClient) → GET /api/... → MongoDB / external SVC

POST | PUT | PATCH | DELETE:
  UI → @services → Server Action → (Zod) → MongoDB
```

`@services` chỉ là lớp TanStack Query phía client — **không** viết business logic nặng ở đây.

### 4.3 Response envelope thống nhất

Mọi Route Handler **và** Server Action trả về cùng shape:

```json
{
    "status": 200,
    "message": "OK",
    "data": {}
}
```

| Field     | Ý nghĩa                                                          |
| --------- | ---------------------------------------------------------------- |
| `status`  | Mã HTTP dạng number: `200`, `201`, `400`, `401`, `404`, `500`, … |
| `message` | Thông điệp ngắn cho người / log                                  |
| `data`    | Payload; lỗi thì thường `null`                                   |

Helpers:

- API: `apiSuccess` / `apiError` — `src/app/api/_lib/http.ts`
- Actions: `apiSuccessResult` / `apiErrorResult` — `src/libs/action.util.ts`
- Client: `unwrapApiResponse()` — ném lỗi nếu `status >= 400`

Ví dụ thành công:

```json
{
    "status": 200,
    "message": "OK",
    "data": [{ "_id": "...", "title": "..." }]
}
```

Ví dụ lỗi:

```json
{
    "status": 400,
    "message": "Title is required",
    "data": null
}
```

### 4.4 Ví dụ hiện có trong repo

| Use case                      | Pattern       | File                                      |
| ----------------------------- | ------------- | ----------------------------------------- |
| List todos                    | GET API       | `src/app/api/todos/route.ts`              |
| Create / update / delete todo | Server Action | `src/actions/todo.action.ts`              |
| Health check                  | GET API       | `src/app/api/health/route.ts`             |
| Login / logout                | Server Action | `src/actions/auth.action.ts`              |
| Auth.js protocol              | API           | `src/app/api/auth/[...nextauth]/route.ts` |

---

## 5. Auth (Auth.js / next-auth v5)

### 5.1 Vai trò từng phần

| File                                      | Vai trò                                                 |
| ----------------------------------------- | ------------------------------------------------------- |
| `src/libs/auth.config.ts`                 | Providers (Credentials), JWT/session callbacks          |
| `src/libs/auth.ts`                        | Export `handlers`, `auth`, `signIn`, `signOut`          |
| `src/app/api/auth/[...nextauth]/route.ts` | Endpoint HTTP của Auth.js (**không bỏ**)                |
| `src/actions/auth.action.ts`              | `loginAction` / `logoutAction` (mutations)              |
| `src/services/auth.service.ts`            | Hooks client: `useLogin`, `useLogout`, `useAuthSession` |
| `src/providers/AuthProvider.tsx`          | `SessionProvider`                                       |
| `src/validations/auth.schema.ts`          | Zod login                                               |
| `src/types/next-auth.d.ts`                | Augment Session / JWT                                   |

### 5.2 Rule auth

- **Session strategy**: JWT (bắt buộc với Credentials).
- **Login/logout từ UI**: dùng Server Action (POST-style), không tự viết REST `/api/login` trùng chức năng.
- **Giữ** `/api/auth/*` vì Auth.js cần để cookie / CSRF / session hoạt động.
- Credentials hiện là **stub** (demo user); sau này thay bằng User MongoDB + bcrypt trong `authorize()`.

### 5.3 Env cần có

```env
AUTH_SECRET=...          # openssl rand -base64 32
AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
MONGODB_URI=...
```

Demo stub (dev):

- email: `demo@averie.local`
- password: `password`

---

## 6. Frontend / UX rules

- Layout chung `AppShell`: nội dung **tối đa 1280px**, căn giữa — màn siêu rộng không kéo vỡ UI.
- Theme: Primary `#2B2623`, Secondary `#D4C5B9`, Tertiary `#F5EFEA`, Neutral `#FDFCFB`.
- Form: ưu tiên **react-hook-form + Zod** (`@hookform/resolvers`).
- Schema Zod đặt ở `src/validations` — dùng cho cả form và Server Action.

---

## 7. MongoDB (serverless)

- Kết nối qua `connectToDatabase()` trong `src/libs/mongodb.ts`.
- **Cache** connection trên `globalThis` để tránh mở connection mới mỗi cold/warm invoke trên Vercel.
- Chỉ dùng `MONGODB_URI` ở server (Route Handler / Server Action / Server Component) — **không** `NEXT_PUBLIC_`.

---

## 8. Checklist khi thêm tính năng mới

1. **Đọc dữ liệu?** → `GET` Route Handler + hook trong `@services` gọi `apiClient`.
2. **Ghi / sửa / xóa?** → Server Action + Zod + hook `@services` gọi action.
3. **Trả về** luôn `{ status, message, data }`.
4. **External / webhook?** → chỉ Route Handler trong `src/app/api`.
5. **Auth UI?** → `loginAction` / `logoutAction`, không bypass Auth.js.
6. Import bằng alias (`@actions`, `@services`, …), không path tương đối lan man.

---

## 9. Tài liệu liên quan

| File                                               | Nội dung                                           |
| -------------------------------------------------- | -------------------------------------------------- |
| [README.md](../README.md)                          | Quick start, env, deploy                           |
| [advanced-workflow.md](./advanced-workflow.md)     | OpenSpec + Superspec + Superpowers + UI/UX Pro Max |
| [working-with-stitch.md](./working-with-stitch.md) | Stitch MCP → implement + iterate UI                |
| [superpowers.md](./superpowers.md)                 | Skill / workflow agent trong Cursor                |
| [AGENTS.md](../AGENTS.md)                          | Hướng dẫn ngắn cho AI agents                       |
| `.env.example`                                     | Biến môi trường mẫu                                |
