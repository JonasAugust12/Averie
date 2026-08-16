# 07 — Admin Bookings

## 1. Phạm vi

Routes:

- `/admin/bookings` — danh sách + filter + cancel/restore
- `/admin/bookings/[id]` — chi tiết (read-only)
- `/admin` dashboard — recent bookings table
- `AdminNewBookingModal` — admin tạo booking thay khách

**Không có approval workflow** — booking public tạo ra là `upcoming` ngay.

## 2. Trạng thái booking

Phase 1 đơn giản hóa:

```
                    ┌──────────────┐
         create ───▶│   upcoming   │
                    └──────┬───────┘
                           │
              admin cancel │ restore
                           ▼
                    ┌──────────────┐
                    │  cancelled   │
                    └──────────────┘
```

| Status      | Ý nghĩa                                        |
| ----------- | ---------------------------------------------- |
| `upcoming`  | Lịch còn hiệu lực                              |
| `cancelled` | Admin (hoặc toggle) hủy — slot được giải phóng |

Mock còn `completed` — **phase 1 bỏ** hoặc giữ enum nhưng không expose UI. Khuyến nghị: chỉ 2 status phase 1.

**Fields:**

- `createdAt` — **bắt buộc**, hiển thị admin list/detail
- `cancelledAt` — set khi cancel, clear khi restore

## 3. Admin actions

| Action          | UI                         | Mô tả                                    |
| --------------- | -------------------------- | ---------------------------------------- |
| View list       | `BookingTableRow`, filters | Sort `createdAt desc`                    |
| View detail     | `/admin/bookings/[id]`     | Full booking + customer                  |
| Cancel          | Toggle / button            | `status → cancelled`, set `cancelledAt`  |
| Restore         | Toggle                     | `status → upcoming`, clear `cancelledAt` |
| Create (manual) | `AdminNewBookingModal`     | Same as public flow, skip marketing      |

Không cần "approve" / "reject".

## 4. API design

### Reads

| Endpoint                         | Query                         | Auth                  |
| -------------------------------- | ----------------------------- | --------------------- |
| `GET /api/bookings`              | `?status=&date=&phone=&page=` | Admin                 |
| `GET /api/bookings/:id`          |                               | Admin                 |
| `GET /api/bookings/by-reference` | `?ref=`                       | Public (confirmation) |
| `GET /api/bookings/slots`        | `?date=&serviceIds=`          | Public                |

Dashboard KPIs: `GET /api/admin/kpis` hoặc derive client-side từ bookings list phase 1.

### Mutations

| Action                 | Auth                         |
| ---------------------- | ---------------------------- |
| `createBookingAction`  | Public (+ admin modal reuse) |
| `cancelBookingAction`  | Admin                        |
| `restoreBookingAction` | Admin                        |

**Toggle pattern:** UI có thể gọi một `toggleBookingCancellationAction(id)` — server detect current status.

## 5. List filters (UI existing)

`BookingFilters` component — map to API query:

| Filter     | Param                        |
| ---------- | ---------------------------- |
| Status     | `status=upcoming\|cancelled` |
| Date range | `from`, `to`                 |
| Search     | `q` (reference, phone, name) |

## 6. Cancel / restore rules

1. Chỉ admin authenticated
2. Restore chỉ từ `cancelled` → re-check slot availability
3. Nếu slot đã bị book bởi booking khác → restore fail với message rõ
4. Cancel idempotent — cancel booking đã cancelled OK

## 7. Admin-created booking

`AdminNewBookingModal` dùng chung `createBookingAction` — có thể thêm flag `source: 'admin'` metadata phase 1.1.

## 8. Display fields (admin list)

| Column      | Source                        |
| ----------- | ----------------------------- |
| Reference   | `reference`                   |
| Customer    | `customer.firstName lastName` |
| Phone       | `customer.phone`              |
| Service(s)  | resolve `serviceIds` names    |
| Staff       | specific name hoặc "Any"      |
| Date / Time | `date`, `time`                |
| Status      | badge                         |
| Created     | `createdAt` formatted         |

## 9. Sequence — cancel

```
Admin UI ──▶ cancelBookingAction ──▶ validate admin session
                                         │
                                         ▼
                              update { status, cancelledAt }
                                         │
                                         ▼
                              invalidate TanStack queries
```

Slot availability cho ngày đó tự cập nhật vì cancelled bookings excluded trong `getAvailableSlotsForDate`.
