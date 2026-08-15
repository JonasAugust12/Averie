# 00 — Naming Conventions (Strict)

## Quy tắc bắt buộc

> **Backend schema là single source of truth.**  
> Tên collection, field, enum và DTO API **chọn tên tốt nhất một lần** ở BE.  
> FE mock hiện tại **không** ràng buộc naming — phase implement BE trước; FE sẽ sửa theo schema BE sau.

| Việc                               | Cho phép                        | Không cho phép                                                    |
| ---------------------------------- | ------------------------------- | ----------------------------------------------------------------- |
| Đặt tên field/collection           | Theo bảng canonical bên dưới    | Giữ tên mock (`active`, `durationMin`, `name`, …) vì FE đang dùng |
| API response                       | Cùng tên field với DB           | Alias field cho tương thích UI cũ                                 |
| Mapper server                      | `_id` → `id`, Date → ISO string | `visible` → `active`, `estimatedMinutes` → `durationMin`          |
| Zod / Mongoose / TypeScript server | Cùng một bộ tên                 | Schema FE riêng lệch BE lâu dài                                   |

**Thứ tự triển khai:**

```
1. Mongoose models + Zod (server)     ← đặt tên ở đây
2. API / Server Actions DTO           ← mirror models
3. @typings + @validations + UI       ← FE cập nhật theo (task riêng)
```

---

## Collections (MongoDB)

| Model (Mongoose)  | Collection           | Mô tả                       |
| ----------------- | -------------------- | --------------------------- |
| `ServiceCategory` | `service_categories` | Phân loại dịch vụ           |
| `Service`         | `services`           | Dịch vụ                     |
| `User`            | `users`              | Admin + staff (credentials) |
| `Booking`         | `bookings`           | Lịch đặt                    |
| `SalonSettings`   | `salon_settings`     | Cấu hình salon (singleton)  |

Quy ước: **model** PascalCase, **collection** snake_case số nhiều.

---

## Field naming chung

| Pattern               | Ví dụ                                   | Ghi chú                                             |
| --------------------- | --------------------------------------- | --------------------------------------------------- |
| camelCase             | `firstName`, `createdAt`                | Mọi field                                           |
| Boolean visibility    | `visible`                               | Hiện trên booking/catalog — **không** dùng `active` |
| Boolean account state | `isActive`                              | Còn đăng nhập được — **không** trộn với `visible`   |
| Thời lượng            | `estimatedMinutes`                      | **không** `durationMin`                             |
| Thời gian audit       | `createdAt`, `updatedAt`, `cancelledAt` | ISO Date trong DB; string ISO trong API             |
| ID reference          | `categoryId`, `staffId`, `serviceIds`   | ObjectId; API trả string                            |
| Primary key API       | `id`                                    | Map từ `_id` — **chỉ** exception được phép          |

---

## Canonical fields theo entity

### ServiceCategory

`name`, `sortOrder`, `createdAt`, `updatedAt`

### Service

`categoryId`, `name`, `description`, `price`, `estimatedMinutes`, `visible`, `createdAt`, `updatedAt`

### User

`email`, `passwordHash`, `role`, `firstName`, `lastName`, `phone`, `note`, `specialties`, `visible`, `isActive`, `staffProfile`, `createdAt`, `updatedAt`

`role`: `'admin' | 'staff'`

### Booking

`reference`, `serviceIds`, `staffPreference`, `staffId`, `date`, `time`, `totalEstimatedMinutes`, `totalPrice`, `customer`, `status`, `cancelledAt`, `createdAt`, `updatedAt`

`staffPreference`: `'any' | 'specific'` — **không** dùng magic string `staffId: 'any'`

`status`: `'upcoming' | 'cancelled'`

`customer`: `{ firstName, lastName, phone, email?, note? }`

### SalonSettings

`allowStaffSelection`, `workingWeekdays`, `periodSlots`, `dayOffs`, `updatedAt`

`dayOffs[]`: `{ id, date, scope }` — `scope`: `'full' | 'morning' | 'afternoon' | 'evening'`

---

## Mock UI → BE (chỉ tham chiếu migration)

Bảng này ghi **sự khác biệt**, không phải lớp alias. FE sẽ đổi sang cột **Canonical (BE)**.

| Mock / FE hiện tại            | Canonical (BE)                            |
| ----------------------------- | ----------------------------------------- |
| `id`                          | `id` (từ `_id`)                           |
| `active`                      | `visible`                                 |
| `durationMin`                 | `estimatedMinutes`                        |
| `name` (staff)                | `firstName` + `lastName`                  |
| `staffId: 'any'`              | `staffPreference: 'any'`, `staffId: null` |
| `serviceId` (+ `serviceIds?`) | `serviceIds[]`                            |
| `SalonStaff` type riêng       | `User` với `role: 'staff'`                |

---

## Mapper server (phạm vi hẹp)

`src/libs/salon.mapper.ts` **chỉ** làm:

- `_id` → `id`
- `Date` → ISO 8601 string (nếu cần)
- Strip `passwordHash` khỏi mọi response

**Không** rename field nghiệp vụ để khớp mock UI.

---

## TypeScript phía server

- `@models/*` — Mongoose schema (source)
- `@validations/*` — Zod mirror cùng tên field
- `@typings/*` — DTO export cho client; **copy naming từ BE**, không fork riêng

Khi FE cập nhật: sửa `@typings/salon.type.ts`, components, stores cho khớp bảng canonical — không yêu cầu BE đổi theo FE.
