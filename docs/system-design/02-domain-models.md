# 02 — Domain Models (MongoDB / Mongoose)

## 1. Tổng quan collections

```
┌─────────────────┐     ┌─────────────────┐
│ ServiceCategory │────<│     Service     │
└─────────────────┘     └────────┬────────┘
                                 │
┌─────────────────┐              │ serviceIds[]
│      User       │              ▼
│ (admin|staff)   │     ┌─────────────────┐
└────────┬────────┘     │     Booking     │
         │               └────────┬────────┘
         │ staffId (optional)     │
         └────────────────────────┘

┌─────────────────┐
│ SalonSettings   │  ← singleton document (schedule + flags)
└─────────────────┘
```

## 2. Naming convention

> **Strict BE-first.** Canonical names below are final for DB, API, Zod. FE mock khác sẽ sửa sau — xem [00-naming-conventions.md](./00-naming-conventions.md).

| Mock / FE hiện tại                    | Canonical (BE)                            | Ghi chú                      |
| ------------------------------------- | ----------------------------------------- | ---------------------------- |
| `id` (string mock)                    | `id`                                      | API map từ `_id`             |
| `active`                              | `visible`                                 | Catalog/booking visibility   |
| `durationMin`                         | `estimatedMinutes`                        | Thời lượng dịch vụ / booking |
| `name` (staff)                        | `firstName` + `lastName`                  | Staff profile                |
| `staffId: 'any'`                      | `staffPreference: 'any'`, `staffId: null` | Không magic string           |
| `serviceId` (+ optional `serviceIds`) | `serviceIds[]`                            | Luôn mảng                    |
| `status: cancelled` only              | `status` + `cancelledAt`                  | Toggle hủy/khôi phục         |

## 3. ServiceCategory

Phân loại dịch vụ — tên + icon Lucide (optional).

```typescript
{
  _id: ObjectId,
  name: string,           // required, trim, max 100
  sortOrder: number,      // optional, default 0 — hiển thị thứ tự
  icon?: string | null,   // PascalCase Lucide React name, e.g. "Sparkles"
  createdAt: Date,
  updatedAt: Date,
}
```

UI fallback: invalid/missing `icon` → `Sparkles`.

**Indexes:** `{ sortOrder: 1 }`, unique sparse trên `name` (case-insensitive collation nếu cần).

**Ghi chú:** Mock hiện dùng fixed ids (`manicure-pedicure`, …). Phase 1 cho phép admin tạo category động; seed migration có thể import categories mặc định.

## 4. Service

Dịch vụ thuộc một phân loại.

```typescript
{
  _id: ObjectId,
  categoryId: ObjectId,   // ref ServiceCategory, required
  name: string,           // required
  description: string,    // required (có thể empty string)
  price: number,          // >= 0, VND hoặc USD tùy locale display
  estimatedMinutes: number, // > 0
  visible: boolean,       // default true — ẩn khỏi booking public
  createdAt: Date,
  updatedAt: Date,
}
```

**Indexes:** `{ categoryId: 1, visible: 1 }`, text index optional trên `name`.

## 5. User (Admin + Staff credentials)

Một collection cho tài khoản đăng nhập. Admin tạo tài khoản staff.

```typescript
type UserRole = 'admin' | 'staff';

{
  _id: ObjectId,
  email: string,            // required, unique, lowercase
  passwordHash: string,     // bcrypt — NEVER expose
  role: UserRole,           // required
  firstName: string,        // required
  lastName: string,         // required
  phone: string,            // required
  note?: string,            // optional
  specialties: string[],    // chỉ meaningful cho staff; admin có thể []
  visible: boolean,         // staff: hiện trong booking flow; admin: N/A
  staffProfile?: {          // chỉ khi role === 'staff'
    color?: string,         // calendar color
    initials?: string,      // derived hoặc lưu cache
  },
  linkedStaffId?: ObjectId, // optional — nếu tách profile sau này
  isActive: boolean,        // soft disable login
  createdAt: Date,
  updatedAt: Date,
}
```

**Thiết kế gộp:** Staff profile + credentials trong cùng document để admin tạo một lần (theo yêu cầu). Không cần collection `Staff` riêng phase 1.

**Indexes:** unique `{ email: 1 }`, `{ role: 1, visible: 1 }`.

## 6. Booking

```typescript
type BookingStatus = 'upcoming' | 'cancelled';
// 'completed' có thể phase 2 — phase 1 admin chỉ cancel/restore

type StaffPreference = 'any' | 'specific';

{
  _id: ObjectId,
  reference: string,        // human-readable, unique e.g. "AV-20260815-0042"
  serviceIds: ObjectId[],   // >= 1 service
  staffPreference: StaffPreference,
  staffId?: ObjectId,       // required when staffPreference === 'specific'
  date: string,             // ISO date "YYYY-MM-DD" (salon timezone)
  time: string,             // normalized "09:00 AM" — same format as schedule.util
  totalEstimatedMinutes: number,  // sum services
  totalPrice: number,       // sum services at booking time
  customer: {
    firstName: string,      // required
    lastName: string,       // required (cập nhật từ mock optional)
    phone: string,          // required
    email?: string,
    note?: string,
  },
  status: BookingStatus,
  cancelledAt?: Date,       // set when status → cancelled
  createdAt: Date,          // required — yêu cầu admin
  updatedAt: Date,
}
```

**Indexes:**

- `{ date: 1, time: 1, status: 1 }` — slot queries
- `{ reference: 1 }` unique
- `{ 'customer.phone': 1 }` — admin search
- `{ createdAt: -1 }` — admin list

## 7. SalonSettings (singleton)

Một document cấu hình salon (id cố định hoặc `findOne` duy nhất).

```typescript
{
  _id: ObjectId,
  allowStaffSelection: boolean,   // bật/tắt bước chọn nhân viên
  workingWeekdays: number[],      // 0=Sun … 6=Sat
  periodSlots: {
    morning: string[],
    afternoon: string[],
    evening: string[],
  },
  dayOffs: [{
    _id: ObjectId,
    date: string,                 // "YYYY-MM-DD"
    scope: 'full' | 'morning' | 'afternoon' | 'evening',
  }],
  updatedAt: Date,
}
```

Tương thích trực tiếp với `ScheduleSettings` trong `src/types/salon.type.ts` và `schedule.util.ts`.

## 8. Zod validation (mirror)

Mỗi entity có schema trong `src/validations/`:

| Schema file                   | Entities                                      |
| ----------------------------- | --------------------------------------------- |
| `service-category.schema.ts`  | create/update category                        |
| `service.schema.ts`           | create/update service                         |
| `staff.schema.ts`             | create/update staff + credentials             |
| `booking.schema.ts`           | customer info, create booking (đã có partial) |
| `schedule-settings.schema.ts` | salon settings                                |
| `auth.schema.ts`              | login (đã có)                                 |

Server Action **luôn** `safeParse` trước khi ghi DB.

## 9. Reference generation

`reference` format đề xuất: `AV-{YYYYMMDD}-{seq4}`

- Seq: atomic counter collection hoặc count bookings trong ngày + 1.
- Hiển thị trên confirmation page và admin list.

## 10. Data integrity rules

1. **Booking create:** tất cả `serviceIds` phải `visible: true`.
2. **Staff specific:** `staffId` phải user `role: staff`, `visible: true`, `isActive: true`.
3. **Staff any:** `staffId` null; backend assign logic phase 1 = không assign cụ thể, chỉ lưu preference.
4. **Slot conflict:** không cho 2 booking `upcoming` cùng `date + time` (phase 1 — salon-level, chưa per-staff).
5. **Cancel/restore:** toggle `status` giữa `upcoming` ↔ `cancelled`; set/clear `cancelledAt`.

## 11. Mapper layer

`src/libs/salon.mapper.ts` — **chỉ serialization**, không đổi tên field nghiệp vụ:

- `_id` → `id`
- `Date` → ISO string (nếu response cần string)
- Omit `passwordHash` trên mọi User DTO

DTO output dùng **đúng tên canonical** (`visible`, `estimatedMinutes`, `firstName`, …). FE cập nhật `@typings` và components theo DTO này.
