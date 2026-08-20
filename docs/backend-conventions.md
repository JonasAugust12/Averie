# Backend conventions — Averie Salon

Tài liệu gom **quy tắc code backend** đã áp dụng cho salon platform (phase 1) và **ma trận ảnh hưởng** khi sửa từng lớp — đặc biệt liên quan API docs, Zod, OpenAPI.

Liên quan: [AGENTS.md](../AGENTS.md), [overview.md](./overview.md), [system-design/09-api-actions.md](./system-design/09-api-actions.md), [system-design/01-architecture.md](./system-design/01-architecture.md).

---

## 1. Quy tắc kiến trúc (bắt buộc)

| Concern                         | Rule                                                                       |
| ------------------------------- | -------------------------------------------------------------------------- |
| **GET / reads**                 | Route Handlers → `src/app/api/**`                                          |
| **POST / PUT / PATCH / DELETE** | Server Actions → `src/actions/**`                                          |
| **External / webhooks**         | Route Handlers → `src/app/api/**`                                          |
| **Response shape**              | Luôn `{ status, message, data }` — xem `@typings/api.type`                 |
| **Auth UI**                     | Server Actions bọc Auth.js `signIn` / `signOut`                            |
| **Auth.js HTTP**                | Giữ `src/app/api/auth/[...nextauth]`                                       |
| **Client data**                 | `@services/*` (TanStack Query) — GET qua `apiClient`, mutation qua actions |
| **Secrets**                     | Không expose `MONGODB_URI`, `AUTH_SECRET` ra client                        |

**Không** đặt CRUD mutation nội bộ trên Route Handlers.

---

## 2. Cấu trúc thư mục backend

```text
src/
  app/api/              # GET Route Handlers + docs endpoints
    _lib/http.ts        # apiSuccess / apiError
    _lib/docs.ts        # ENABLE_API_DOCS gate
  actions/              # Server Actions (mutations)
  models/               # Mongoose schemas
  validations/          # Zod — input / query / action payload (runtime validate)
  mappers/              # DB document → DTO (serialize*)
  types/salon/          # TypeScript DTO types (FE + server)
  utils/                # Domain logic thuần (booking.util, schedule.util)
  libs/                 # Hạ tầng: mongodb, auth, action.util, schedule.server
  openapi/              # API documentation only (không validate runtime)
    spec.ts             # Merge generated spec + fragments + examples
    schemas/            # Zod mô tả response cho OpenAPI
    examples/           # Sample JSON thực tế cho Scalar
openapi/
  generated/            # Output của pnpm openapi:gen (git có thể commit)
  fragments/actions.yaml # Server Actions — pseudo-paths, doc-only
```

### Alias import

| Alias                     | Folder              | Vai trò                                            |
| ------------------------- | ------------------- | -------------------------------------------------- |
| `@validations/*`          | `src/validations/*` | Zod **request** — validate runtime                 |
| `@openapi/*`              | `src/openapi/*`     | Zod **response** + examples — **chỉ docs**         |
| `@mappers` / `@mappers/*` | `src/mappers/*`     | Serialize model → DTO                              |
| `@typings/*`              | `src/types/*`       | TypeScript types                                   |
| `@models/*`               | `src/models/*`      | Mongoose                                           |
| `@actions/*`              | `src/actions/*`     | Server Actions                                     |
| `@utils/*`                | `src/utils/*`       | Business helpers (không phải TanStack `@services`) |
| `@libs/*`                 | `src/libs/*`        | Infra (mongo, auth, …)                             |

---

## 3. Phân tách trách nhiệm từng lớp

### 3.1 Route Handler (GET)

```text
Request → auth-guard (nếu cần) → Zod safeParse query/path
       → connectToDatabase → Model.find
       → mapper (serialize*) → apiSuccess(data)
```

- Validate query/path bằng schema trong `@validations/*`.
- Trả lỗi qua `apiError(message, status)` — body vẫn envelope `{ status, message, data: null }`.
- Khai báo JSDoc `@openapi`, `@response`, `@responseSet`, `@pathParams` / `@queryParams` cho docs.

### 3.2 Server Action (mutation)

```text
Input → parseActionInput(zodSchema, input) → business logic (@utils, @libs)
     → Model create/update → mapper → apiSuccessResult / apiErrorResult
```

- Validate bằng `@validations/*` — **không** dùng `@openapi/schemas`.
- **Bắt buộc docs:** mỗi lần thêm/sửa/xóa Server Action → cập nhật `openapi/fragments/actions.yaml` (xem [§5.3](#53-server-actions--openapi-fragments)).

### 3.3 Validations vs OpenAPI schemas

|                        | `@validations/*`                     | `@openapi/schemas/*`                    |
| ---------------------- | ------------------------------------ | --------------------------------------- |
| **Mục đích**           | Validate input runtime               | Mô tả response cho docs                 |
| **Dùng ở**             | Actions, Route Handlers (query/body) | JSDoc `@response` trên routes           |
| **Sai lầm thường gặp** | Nhét response DTO vào validations    | Dùng openapi schema để validate request |

Hai folder **có thể trùng hình dạng field** (ví dụ `bookingDtoSchema` vs type `BookingDto`) — giữ **đồng bộ thủ công** khi đổi shape response.

### 3.4 Mappers

- Một file mapper / domain: `booking.mapper.ts`, `user.mapper.ts`, …
- Export `serializeX(doc)` → DTO đúng `@typings/salon/*`.
- Route Handler / Action **không** trả raw Mongoose document.

### 3.5 Types (`src/types/salon/`)

- `*.type.ts` theo domain — contract cho FE và server.
- Mapper output phải khớp type; OpenAPI schemas nên mirror cùng shape.

### 3.6 Utils vs libs

|           | `@utils/*`                                        | `@libs/*`                                           |
| --------- | ------------------------------------------------- | --------------------------------------------------- |
| Ví dụ     | `booking.util.ts`, `schedule.util.ts`             | `mongodb.ts`, `auth-guard.ts`, `schedule.server.ts` |
| Nội dung  | Logic nghiệp vụ thuần, testable                   | Infra, DB wrapper, auth                             |
| **Không** | `.service.ts` ở đây (reserved cho FE `@services`) | Business rules dài                                  |

---

## 4. Response envelope

Mọi Route Handler và Server Action:

```typescript
type ApiResponse<T> = {
    status: number; // mirrored trong body
    message: string;
    data: T | null;
};
```

- Success: `apiSuccess(data, 'OK')` / `apiSuccessResult(data)`.
- Error: `apiError(msg, 400)` / `apiErrorResult(msg, 400)`.
- HTTP status code = `body.status` (Route Handlers).

### 4.1 Response Obfuscation (AES-256-GCM)

Để ngăn người tò mò dùng Network / DevTools đọc trực tiếp JSON API response từ GET Route Handlers:

- **Server-side**: Khi `ENABLE_OBFUSCATION=1`, `apiSuccess()` (`src/app/api/_lib/http.ts`) tự mã hóa payload `data` thành chuỗi base64 dạng `iv.authTag.ciphertext` thông qua `@server/encryption.server.ts` (dùng Node.js `crypto` AES-256-GCM + random 12-byte IV).
- **Client-side**: Khi `NEXT_PUBLIC_ENABLE_OBFUSCATION=true`, `apiClient` (`src/libs/api-client.ts` - Axios interceptor) tự động giải mã `data` bằng Web Crypto API (`src/utils/decryption.client.ts`) trước khi dữ liệu đi vào TanStack Query hooks.
- **Error responses**: `apiError()` **không bao giờ mã hóa** — giúp client đọc và hiển thị thông báo lỗi bình thường.
- **Server Actions**: Không đi qua Route Handler HTTP response public nên không cần obfuscate.

OpenAPI mô tả đúng envelope: `status`, `message`, `data` — xem `*ApiResponseSchema` trong `@openapi/schemas`.

---

## 5. API documentation (Scalar)

### 5.1 Endpoints docs

| URL                 | Mục đích          |
| ------------------- | ----------------- |
| `/api/docs`         | UI Scalar (dev)   |
| `/api/openapi.json` | OpenAPI spec JSON |

Bật khi `ENABLE_API_DOCS=1` trong `.env.local`. Production: unset → 404.

### 5.2 Luồng generate

```text
Route JSDoc (@openapi, @response, …)
        +
src/openapi/schemas/*.ts
src/validations/*.ts          ──►  pnpm openapi:gen  ──►  openapi/generated/openapi.json
        +
openapi/fragments/actions.yaml
        │
        ▼
src/openapi/spec.ts  ── merge + inject examples  ──►  GET /api/openapi.json
```

- `pnpm dev` chạy `openapi:gen` trước `next dev`.
- Sau khi sửa route JSDoc hoặc openapi schemas: `pnpm openapi:gen`.
- **Chỉ sửa Server Action / `actions.yaml`:** không cần `openapi:gen` — `spec.ts` merge YAML lúc runtime; refresh `/api/docs` (hoặc restart dev nếu cache).

Config: `next.openapi.json` — scan `src/openapi/schemas` + `src/validations`.

### 5.3 Server Actions — OpenAPI fragments

Server Actions **không** có HTTP route thật → không scan được bởi `openapi:gen`. Docs nằm ở file thủ công:

**`openapi/fragments/actions.yaml`**

| Việc                                    | Cập nhật trong YAML                                                                                                              |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Action **mới**                          | Thêm path `/actions/<tênAction>` (vd. `/actions/createBooking`), tag `Server Actions`, `requestBody` / `parameters`, `responses` |
| Đổi **input** (field, type, required)   | `requestBody.schema` hoặc `parameters` — mirror `@validations/*`                                                                 |
| Đổi **response** (status, shape `data`) | Block `responses` (`200`, `201`, `409`, …) + mô tả; shape chi tiết nếu FE cần                                                    |
| Đổi **auth / role**                     | `description` (vd. "Admin only") — optional `security` nếu sau này bổ sung                                                       |
| **Xóa** action                          | Xóa entry tương ứng trong YAML                                                                                                   |

Quy ước path: `/actions/<camelCaseActionName>` khớp tên export (vd. `createBookingAction` → summary `createBookingAction`).

```yaml
/actions/createBooking:
    post:
        tags: [Server Actions]
        summary: createBookingAction
        description: Invoked via Next.js Server Action — not a public HTTP endpoint.
        requestBody: { ... }
        responses:
            '201': { description: Booking created }
            '409': { description: Slot conflict }
```

**Checklist mỗi PR có đụng `src/actions/`:**

1. Code + `@validations` đã khớp input mới.
2. `openapi/fragments/actions.yaml` đã cập nhật cùng PR.
3. Mở `/api/docs` → tab **Server Actions** — kiểm tra request/response mô tả.

**Không** cần `@openapi/schemas` hay `@openapi/examples` cho actions (trừ khi sau này chuẩn hóa envelope example trong YAML).

### 5.4 Cấu trúc `src/openapi/`

| Path                     | Vai trò                                                                 |
| ------------------------ | ----------------------------------------------------------------------- |
| `schemas/*.schema.ts`    | Zod response schemas; export tên khớp `@response` trên route            |
| `examples/*.examples.ts` | Object mẫu theo domain (Jane Doe, AVR-…, ObjectIds cố định)             |
| `examples/responses.ts`  | Full envelope `{ status, message, data }` — map schema name → example   |
| `examples/ids.ts`        | ObjectId / date / reference dùng chung                                  |
| `spec.ts`                | Load generated JSON, prefix `/api`, merge actions YAML, inject examples |

**Examples hiển thị trên Scalar** đến từ `responses.ts` + `injectResponseExamples()` trong `spec.ts` — không chỉ từ Zod `.meta()`.

---

## 6. Ma trận ảnh hưởng — sửa X cần sửa Y

Dùng bảng này trước khi merge PR backend.

### 6.1 Thay đổi request (query, path, action input)

| Bạn sửa                             | Bắt buộc                                         | OpenAPI / docs                                                      | Ghi chú                                      |
| ----------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------- | -------------------------------------------- |
| Query param GET (thêm/sửa/đổi type) | `@validations/*.schema.ts` + Route Handler parse | JSDoc `@queryParams` hoặc để gen infer; `pnpm openapi:gen`          | **Không** cần `openapi/examples`             |
| Path param `{id}`                   | `@validations` (e.g. `bookingIdSchema`) + route  | `@pathParams` trên route                                            |                                              |
| Server Action input                 | `@validations` + action `parseActionInput`       | **`openapi/fragments/actions.yaml`** — `requestBody` / `parameters` | Không cần `openapi:gen`; refresh `/api/docs` |
| Chỉ đổi message validation          | `@validations`                                   | Không bắt buộc                                                      |                                              |

### 6.2 Thay đổi response GET (shape `data`)

| Bạn sửa                                      | Bắt buộc                                        | OpenAPI / docs    |
| -------------------------------------------- | ----------------------------------------------- | ----------------- |
| Field DTO public (thêm/xóa/đổi type)         | `@typings/salon/*.type.ts`                      |                   |
|                                              | `@mappers/*` serialize                          |                   |
|                                              | `@openapi/schemas/*` DTO + `*ApiResponseSchema` |                   |
|                                              | `@openapi/examples/*` sample objects            |                   |
|                                              | `@openapi/examples/responses.ts` envelope map   |                   |
|                                              | Route `@response` nếu đổi tên schema            |                   |
|                                              | `pnpm openapi:gen` + kiểm tra `/api/docs`       |                   |
| Chỉ đổi logic/filter DB, **shape không đổi** | Handler / util                                  | Không cần openapi |

### 6.3 Thay đổi response Server Action

| Bạn sửa                   | Bắt buộc                   | OpenAPI / docs                                     |
| ------------------------- | -------------------------- | -------------------------------------------------- |
| Return type action        | `@typings`, mapper, action | **`openapi/fragments/actions.yaml`** — `responses` | Không cần `@openapi/schemas` |
| Chỉ status code / message | Action                     | YAML `responses` (optional)                        |                              |

### 6.4 Database / model

| Bạn sửa                 | Bắt buộc                 | OpenAPI                                    |
| ----------------------- | ------------------------ | ------------------------------------------ |
| Mongoose schema field   | `src/models/*`           | Chỉ nếu field lộ ra DTO                    |
| Index / collection name | model                    | Không                                      |
| Seed data               | `scripts/seed-salon.mjs` | Không (trừ khi đổi example IDs trong docs) |

### 6.5 Auth / middleware

| Bạn sửa         | Files                                                 |
| --------------- | ----------------------------------------------------- |
| Role check      | `@libs/auth-guard.ts`, `@libs/auth.config.ts`         |
| Route cần admin | Route: `requireAdmin()` + `@auth sessionCookie` JSDoc |

### 6.6 Endpoint GET mới — checklist

1. `src/app/api/<path>/route.ts` — GET, `apiSuccess`/`apiError`, `runtime = 'nodejs'`.
2. `@validations` — query/path schema nếu có params.
3. `@mappers` + `@typings` — DTO response.
4. `@openapi/schemas` — `*ApiResponseSchema` (z.object explicit, **không** wrap bằng helper function — openapi-gen cần AST tĩnh).
5. `@openapi/examples` — domain example + entry trong `responses.ts`.
6. JSDoc: `@openapi`, `@response`, `@responseSet common`, `@pathParams` / `@queryParams`, `@auth` nếu protected.
7. `pnpm openapi:gen` → mở `/api/docs` verify example JSON.
8. (Tuỳ chọn) `docs/system-design/09-api-actions.md` nếu endpoint public contract.

### 6.7 Server Action mới — checklist

1. `src/actions/<domain>.action.ts` — `'use server'`, `parseActionInput`, envelope result.
2. `@validations` — input schema.
3. Business logic → `@utils` hoặc `@libs` (không phình action).
4. **`openapi/fragments/actions.yaml`** — pseudo-path `/actions/...` + request/response (bắt buộc cùng PR).
5. Không cần `@openapi/schemas` / `pnpm openapi:gen` cho action thuần.

---

## 7. Zod — quy ước validate

### Route Handler (query)

```typescript
const parsed = bookingsListQuerySchema.safeParse({
    page: searchParams.get('page') ?? undefined,
    // ...
});
if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message ?? 'Validation failed', 400);
}
```

### Server Action

```typescript
const parsed = parseActionInput(createBookingSchema, input);
if (parsed.status >= 400 || !parsed.data) {
    return apiErrorResult(parsed.message, parsed.status);
}
```

### OpenAPI response schema (docs only)

```typescript
export const bookingDetailApiResponseSchema = z
    .object({
        status: z.number().int().describe('HTTP status code (mirrored in body)'),
        message: z.string(),
        data: bookingDtoSchema,
    })
    .meta({ examples: [{ status: 200, message: 'OK', data: bookingExample }] });
```

- **Ưu tiên** cập nhật example thật trong `examples/*.ts` + `responses.ts` (Scalar đọc từ `spec.ts`).
- Dùng `objectIdSchema` từ `@validations/service-category.schema` trong openapi schemas khi cần format id.

---

## 8. Lệnh thường dùng

```bash
pnpm dev              # openapi:gen + next dev
pnpm openapi:gen      # Regenerate openapi/generated/openapi.json
pnpm type-check
pnpm lint
pnpm db:check         # Ping MongoDB
pnpm db:seed          # Seed admin + catalog mẫu
```

MongoDB local: xem `.env.example` — SRV URI + `MONGODB_DNS_SERVERS` trên Windows nếu `querySrv ECONNREFUSED`.

---

## 9. Ví dụ nhanh — đổi field `BookingDto`

Giả sử thêm `source: 'web' | 'admin'` vào booking public:

| #   | File                                       | Việc                                           |
| --- | ------------------------------------------ | ---------------------------------------------- |
| 1   | `src/types/salon/booking.type.ts`          | Thêm `source` vào `BookingDto`                 |
| 2   | `src/models/booking.model.ts`              | Field DB (nếu persist)                         |
| 3   | `src/mappers/booking.mapper.ts`            | Map `source`                                   |
| 4   | `src/openapi/schemas/booking.schema.ts`    | `bookingDtoSchema` + response schemas          |
| 5   | `src/openapi/examples/booking.examples.ts` | `source: 'web'` trong `bookingExample`         |
| 6   | `src/openapi/examples/responses.ts`        | Tự cập nhật nếu dùng `bookingExample` (import) |
| 7   | `pnpm openapi:gen`                         | Refresh spec                                   |
| 8   | `/api/docs`                                | Verify example                                 |

**Không** cần sửa `@validations/booking.schema.ts` trừ khi field cũng là input (create/update booking).

---

## 10. Những thứ **không** ảnh hưởng API docs

- Refactor nội bộ utils/libs (signature private không đổi).
- Đổi `MONGODB_URI`, seed script, index DB.
- UI components, `@services` mocks (phase wire-up sau).
- Comment, log, format.

---

## 11. Tài liệu liên quan

| Doc                                                                                | Nội dung                 |
| ---------------------------------------------------------------------------------- | ------------------------ |
| [system-design/00-naming-conventions.md](./system-design/00-naming-conventions.md) | Tên field BE-first       |
| [system-design/09-api-actions.md](./system-design/09-api-actions.md)               | Bảng endpoints + actions |
| [system-design/03-booking.md](./system-design/03-booking.md)                       | Domain booking           |
| [AGENTS.md](../AGENTS.md)                                                          | Rule ngắn cho AI agent   |
