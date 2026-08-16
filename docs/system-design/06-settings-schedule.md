# 06 — Settings & Schedule

## 1. Phạm vi

Route: `/admin/settings/schedule` (đã có UI)  
Logic: `src/utils/schedule.util.ts`

Admin cấu hình:

| Cấu hình                | Mô tả                                       |
| ----------------------- | ------------------------------------------- |
| **allowStaffSelection** | Bật/tắt bước chọn nhân viên trong booking   |
| **weekdaySchedules**    | Giờ mở cửa **theo từng ngày** (0=CN … 6=T7) |
| **dayOffs**             | Ngày nghỉ (cả ngày hoặc theo buổi)          |

## 2. Singleton document

Lưu collection `SalonSettings` — **một document duy nhất** per deployment (single salon app).

**Bootstrap:** `pnpm db:seed` hoặc `getSalonSettingsDocument()` tạo default nếu chưa có.

```typescript
// Default seed — defaultWeekdaySchedules() in schedule.util.ts
{
  allowStaffSelection: true,
  weekdaySchedules: [
    // 7 entries: weekday 0–6
    { weekday: 1, isOpen: true, periodSlots: { morning: [...], afternoon: [...], evening: [...] } },
    // Mon–Fri: 9am–6pm last slot; Sat: last 5:30pm; Sun: opens 10am, no evening
  ],
  dayOffs: [],
}
```

## 3. weekdaySchedules — Giờ theo ngày

Mỗi phần tử:

```typescript
{
  weekday: number,   // 0=Sun … 6=Sat
  isOpen: boolean,   // thay cho workingWeekdays
  periodSlots: {
    morning:   string[],
    afternoon: string[],
    evening:   string[],
  },
}
```

- Admin UI: tab T2 → CN, toggle mở/đóng + slots riêng từng ngày
- Normalize qua `normalizeTimeInput()` trước khi lưu
- Sort qua `sortTimes()`
- Legacy docs DB cũ (`workingWeekdays` + `periodSlots` chung) được migrate khi đọc qua `normalizeWeekdaySchedules()` trong mapper

**Không** dynamic generate từ open/close range — admin khai báo discrete slots (đúng UI hiện tại).

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
   weekdaySchedules   (per day)        dayOffs
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
