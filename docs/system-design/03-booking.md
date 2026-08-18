# 03 — Booking (Khách hàng)

## 1. User story

Khách **không cần đăng nhập** để đặt lịch. Luồng wizard 6 bước (UI đã có tại `src/app/(user)/book`).

## 2. Luồng wizard

```
 Step 1          Step 2         Step 3              Step 4
┌─────────┐    ┌─────────┐    ┌──────────────┐    ┌─────────┐
│ Dịch vụ │───▶│  Ngày   │───▶│  Nhân viên   │───▶│  Giờ    │
│ (multi) │    │         │    │ any / chọn 1 │    │         │
└─────────┘    └─────────┘    └──────────────┘    └─────────┘
                                                      │
 Step 6          Step 5                              │
┌─────────┐    ┌─────────┐◀──────────────────────────┘
│ Xác nhận│◀───│ Thông tin│
│         │    │  KH     │
└─────────┘    └─────────┘
```

| Step | Component      | State (Zustand)               |
| ---- | -------------- | ----------------------------- |
| 1    | `ServiceStep`  | `selectedServiceIds[]`        |
| 2    | `DateStep`     | `selectedDate`                |
| 3    | `EmployeeStep` | `staffPreference`, `staffId?` |
| 4    | `TimeStep`     | `selectedTime`                |
| 5    | `CustomerStep` | `customer{...}`               |
| 6    | `ReviewStep`   | review + submit               |

Store: `src/stores/booking.store.ts` — giữ persist draft customer vào localStorage.

## 3. Step 3 — Chọn nhân viên

Phụ thuộc `SalonSettings.allowStaffSelection`:

| `allowStaffSelection` | Hành vi                                                 |
| --------------------- | ------------------------------------------------------- |
| `false`               | Bỏ qua step 3; auto `staffPreference: 'any'`            |
| `true`                | Hiện step: **Bất kỳ** hoặc **Chọn 1 nhân viên visible** |

Danh sách nhân viên: GET `/api/staff?visible=true` (chỉ staff `role: staff`, `visible: true`).

## 4. Step 4 — Chọn giờ

**Input:** `date`, `serviceIds` (tính duration), `settings`, existing bookings.

**Logic:** tái sử dụng `getAvailableSlotsForDate()` trong `src/utils/schedule.util.ts` — chuyển sang server:

```
GET /api/bookings/slots?date=YYYY-MM-DD&serviceIds=id1,id2&staffPreference=any|specific&staffId=...
```

Server:

1. Load `SalonSettings`
2. Load bookings `upcoming` cùng `date` (kèm `staffId`, `staffPreference`)
3. Tính slots available theo nhân viên đã chọn (specific) hoặc toàn salon (any)
4. Khóa slot đã qua / trong vòng 1 giờ tới (nếu `date` là hôm nay, timezone salon)
5. Chỉ cho phép `date` trong khoảng hôm nay → +15 ngày

**Quy tắc đặt lịch (guest):**

| Rule                          | Giá trị                                             |
| ----------------------------- | --------------------------------------------------- |
| Book trước tối thiểu          | 1 giờ so với giờ salon hiện tại (nếu chọn hôm nay)  |
| Chọn ngày tối đa              | 15 ngày kể từ hôm nay                               |
| Slot đã book (specific staff) | Khóa các giờ nhân viên đó đã có lịch `upcoming`     |
| Slot đã book (any)            | Khóa nếu đã có bất kỳ booking `upcoming` tại giờ đó |

**Response:**

```json
{
    "status": 200,
    "message": "OK",
    "data": {
        "date": "2026-08-18",
        "slots": [
            {
                "id": "morning-0-0900AM",
                "time": "09:00 AM",
                "available": false,
                "lockReason": "too_soon"
            },
            { "id": "morning-1-0930AM", "time": "09:30 AM", "available": true }
        ]
    }
}
```

`lockReason`: `booked` | `too_soon` (optional, khi `available: false`).

## 5. Step 5 — Thông tin khách

| Field     | Bắt buộc | Ghi chú                              |
| --------- | -------- | ------------------------------------ |
| firstName | ✓        |                                      |
| lastName  | ✓        | Cập nhật schema — mock hiện optional |
| phone     | ✓        | min 7 ký tự                          |
| email     |          | validate email nếu có                |
| note      |          | max 500 ký tự                        |

Schema: `bookingCustomerSchema` — cần sửa `lastName` thành required khi implement.

## 6. Submit booking

**Mutation:** `createBookingAction` (Server Action)

**Input:**

```typescript
{
  serviceIds: string[],
  staffPreference: 'any' | 'specific',
  staffId?: string,
  date: string,
  time: string,
  customer: BookingCustomerInput,
}
```

**Server steps:**

1. Zod validate
2. Load services → tính price, estimatedMinutes
3. Validate date/slot still available (race: re-check trước insert)
4. Validate staff nếu specific
5. Generate `reference`
6. Insert Booking
7. Return `{ reference, id, ... }`

**Sau submit:** redirect `/book/confirmation?ref=AV-...`

## 7. Confirmation page

GET `/api/bookings/by-reference?ref=AV-...` (public, không lộ PII nhạy cảm ngoài booking vừa tạo).

Hoặc pass snapshot qua query/state — ưu tiên API để refresh được.

## 8. Sequence diagram

```
Customer          BookPageView       createBookingAction        MongoDB
   │                   │                      │                    │
   │── select flow ───▶│                      │                    │
   │                   │── GET services ──────┼──▶ /api/services   │
   │                   │── GET slots ─────────┼──▶ /api/.../slots  │
   │── confirm ───────▶│                      │                    │
   │                   │── createBooking ────▶│                    │
   │                   │                      │── validate ───────▶│
   │                   │                      │── insert booking ─▶│
   │                   │◀── { reference } ────│                    │
   │◀── redirect ──────│                      │                    │
```

## 9. Edge cases

| Case                                 | Xử lý                                                                                |
| ------------------------------------ | ------------------------------------------------------------------------------------ |
| Slot vừa bị book                     | 409-style message: "Time no longer available"                                        |
| Slot quá sớm (< 1 giờ)               | 400: "Selected time must be at least 1 hour from now"                                |
| Ngày quá xa (> 15 ngày)              | 400: "Selected date is not available for booking"                                    |
| Service bị ẩn giữa chừng wizard      | Re-validate on submit; báo lỗi quay step 1                                           |
| `allowStaffSelection` tắt giữa chừng | Server enforce `any`                                                                 |
| Multi-service                        | Lưu tất cả `serviceIds`; hiển thị tổng giá & thời gian                               |
| Timezone                             | Store `date` theo salon TZ (config env `SALON_TIMEZONE`, default `Asia/Ho_Chi_Minh`) |

## 10. Không thuộc phase 1

- Customer login / booking history
- Deposit / payment
- SMS/email confirmation
- Auto-assign staff khi chọn "any"
