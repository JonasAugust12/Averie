# 05 — Staff (Nhân viên)

## 1. Phạm vi

Route admin: `/admin/staff`  
Components: `src/components/admin/staff/*`

Admin quản lý nhân viên:

- CRUD thông tin
- Toggle visible (hiện trong booking flow)
- **Tạo tài khoản** email + mật khẩu (do admin đặt)
- Xem lịch: `/admin/staff/[id]/schedule` (calendar — read bookings)

Staff portal: `/staff` — đăng nhập bằng tài khoản admin tạo.

## 2. Fields

| Field                | Required | Ghi chú                                                  |
| -------------------- | -------- | -------------------------------------------------------- |
| firstName            | ✓        |                                                          |
| lastName             | ✓        |                                                          |
| phone                | ✓        |                                                          |
| email                |          | optional contact; **login email có thể trùng field này** |
| note                 |          | optional                                                 |
| specialties          |          | `string[]` — chuyên môn                                  |
| visible              |          | boolean — hiện ở bước chọn NV booking                    |
| credentials.email    | ✓        | unique — dùng login                                      |
| credentials.password | ✓        | chỉ khi create / reset — bcrypt server-side              |

**Quyết định phase 1:** Một email cho cả login và contact (field `email` required cho staff có tài khoản).

UI mock dùng `name` single field + `role` job title — thiết kế mới:

| Mock field                | New design                                      |
| ------------------------- | ----------------------------------------------- |
| `name`                    | `firstName` + `lastName`                        |
| `role` (Lead Nail Artist) | có thể giữ làm `specialties[0]` hoặc bỏ phase 1 |
| `initials`                | derived: `deriveInitials(firstName, lastName)`  |
| `color`                   | `staffProfile.color` — calendar                 |
| `active`                  | `visible` (booking) + `isActive` (login)        |

## 3. Admin tạo staff flow

```
Admin opens StaffFormModal
        │
        ├── Personal info (firstName, lastName, phone, email?, note)
        ├── Specialties (comma-separated → array)
        ├── Visible toggle
        └── Login section (email, password, confirm password)  ← chỉ khi CREATE
        │
        ▼
createStaffAction
        │
        ├── Zod validate
        ├── Hash password (bcrypt, cost 12)
        ├── Insert User { role: 'staff', ... }
        └── Return staff DTO (no passwordHash)
```

**Edit staff:** không hiện password; optional `resetStaffPasswordAction` riêng.

## 4. API design

### Reads

| Endpoint                      | Mô tả                 | Auth                                     |
| ----------------------------- | --------------------- | ---------------------------------------- |
| `GET /api/staff`              | List staff            | Public: `?visible=true` only; Admin: all |
| `GET /api/staff/:id`          | Detail                | Admin                                    |
| `GET /api/staff/:id/bookings` | Bookings for calendar | Admin / Staff (own)                      |

### Mutations (admin only)

| Action                     | Mô tả                                     |
| -------------------------- | ----------------------------------------- |
| `createStaffAction`        | Tạo staff + credentials                   |
| `updateStaffAction`        | Sửa profile, visible                      |
| `deleteStaffAction`        | Soft: `isActive: false`, `visible: false` |
| `resetStaffPasswordAction` | Admin reset MK                            |

## 5. Staff portal auth

Thay phone lookup mock (`/staff`) bằng **Credentials login** qua Auth.js:

- Cùng `User` collection, `role: 'staff'`
- Session JWT chứa `{ id, email, role: 'staff', name }`
- Staff chỉ xem booking gán cho mình (`staffId`) hoặc `staffPreference: any` (policy: phase 1 show all `any` + assigned)

## 6. Calendar views

Existing utilities giữ nguyên:

- `src/utils/staff-calendar.util.ts`
- `src/components/admin/staff/StaffCalendar.tsx`
- FullCalendar events build từ GET bookings

Data source chuyển từ mock → API.

## 7. Security notes

- Không bao giờ trả `passwordHash` về client
- Admin không thể xem plaintext password sau create
- Rate-limit login (middleware / Auth.js) — optional phase 1.1

## 8. Diagram

```
                    ┌─────────────────────┐
                    │   User collection    │
                    │ role: admin | staff  │
                    └──────────┬──────────┘
                               │
         ┌─────────────────────┼─────────────────────┐
         ▼                     ▼                     ▼
  createStaffAction      Staff login (/staff)   GET /api/staff?visible=true
  (admin only)           Auth.js JWT            (booking step 3)
```
