# 06 — Settings & Schedule

## 1. Phạm vi

Route: `/admin/settings/schedule` (đã có UI)  
Logic: `src/utils/schedule.util.ts`

Admin cấu hình:

| Cấu hình                | Mô tả                                          |
| ----------------------- | ---------------------------------------------- |
| **allowStaffSelection** | Bật/tắt bước chọn nhân viên trong booking      |
| **workingWeekdays**     | Ngày làm việc trong tuần (0=CN … 6=T7)         |
| **periodSlots**         | Khung giờ mở cửa theo buổi: sáng / chiều / tối |
| **dayOffs**             | Ngày nghỉ (cả ngày hoặc theo buổi)             |

## 2. Singleton document

Lưu collection `SalonSettings` — **một document duy nhất** per deployment (single salon app).

**Bootstrap:** migration/seed tạo default nếu chưa có (copy từ `mockScheduleSettings`).

```typescript
// Default seed (align mock)
{
  allowStaffSelection: true,
  workingWeekdays: [1, 2, 3, 4, 5, 6],  // Mon–Sat
  periodSlots: defaultPeriodSlots,       // from schedule.util
  dayOffs: [],
}
```

## 3. periodSlots — Thời gian mở cửa

Cấu trúc 3 buổi, mỗi buổi là mảng string giờ:

```typescript
periodSlots: {
  morning:   ['09:00 AM', '09:30 AM', ...],
  afternoon: ['12:00 PM', '12:30 PM', ...],
  evening:   ['05:00 PM', '05:30 PM', ...],
}
```

- Admin thêm/xóa slot qua UI hiện có
- Normalize qua `normalizeTimeInput()` trước khi lưu
- Sort qua `sortTimes()`

**Không** dynamic generate từ open/close range phase 1 — admin khai báo discrete slots (đúng UI hiện tại).

## 4. dayOffs — Ngày nghỉ

```typescript
{
  date: '2026-12-25',
  scope: 'full' | 'morning' | 'afternoon' | 'evening',
}
```

| scope                               | Ý nghĩa                 |
| ----------------------------------- | ----------------------- |
| `full`                              | Cả ngày đóng            |
| `morning` / `afternoon` / `evening` | Chỉ đóng buổi tương ứng |

Logic đã implement trong:

- `isDateFullyClosed()`
- `getOffPeriodsForDate()`
- `getAvailableSlotsForDate()`

## 5. allowStaffSelection

| Value   | Booking wizard                                        |
| ------- | ----------------------------------------------------- |
| `true`  | Step 3 hiện — chọn any hoặc specific staff            |
| `false` | Skip step 3; server luôn lưu `staffPreference: 'any'` |

Toggle có hiệu lực ngay — không cache client lâu (invalidate booking store step guards).

## 6. API design

### Reads

| Endpoint                     | Mô tả                  | Auth                                               |
| ---------------------------- | ---------------------- | -------------------------------------------------- |
| `GET /api/settings/schedule` | Full schedule settings | Public (booking cần slots); sensitive data minimal |

Public read OK vì chỉ lịch mở cửa — không secret.

### Mutations

| Action                         | Auth       |
| ------------------------------ | ---------- |
| `updateScheduleSettingsAction` | Admin only |

Replace mock `useSaveScheduleSettings` → mutation gọi action.

## 7. Slot availability (shared logic)

```
                    SalonSettings
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
   workingWeekdays    periodSlots      dayOffs
          │               │               │
          └───────────────┼───────────────┘
                          ▼
              getAvailableSlotsForDate(date, settings, bookings)
                          │
                          ▼
              TimeSlot[] { time, available }
```

**Phase 1 limitation:** availability check theo **time slot string**, không trừ theo `staffId` riêng. Document rõ trong open questions nếu salon cần per-staff.

## 8. Timezone

- Dates stored as `YYYY-MM-DD` strings interpreted in salon timezone
- Env: `SALON_TIMEZONE=Asia/Ho_Chi_Minh`
- `new Date(\`${date}T12:00:00\`)`trong util — review khi implement server (dùng`@date-fns/tz`hoặc`Temporal` nếu cần)

## 9. Future: /admin/settings index

Phase 1 chỉ có schedule settings. Có thể thêm `/admin/settings` hub sau cho branding, contact info, etc.
