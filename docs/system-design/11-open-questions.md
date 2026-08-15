# 11 — Open Questions & Decisions

Các điểm cần bạn xác nhận trước hoặc trong lúc `/opsx-propose`.

## Đã quyết định trong thiết kế

| #   | Câu hỏi                 | Quyết định                                                                                     |
| --- | ----------------------- | ---------------------------------------------------------------------------------------------- |
| D1  | TypeORM hay Mongoose?   | **Mongoose 8** — đã có trong repo                                                              |
| D2  | Staff collection riêng? | **Gộp User** (role staff) + profile fields                                                     |
| D3  | Booking approval?       | **Không** — tạo là upcoming                                                                    |
| D4  | Cancel model?           | **Toggle** upcoming ↔ cancelled                                                                |
| D5  | Auth third-party?       | **Không** phase 1                                                                              |
| D6  | Customer login?         | **Không** cần cho booking                                                                      |
| D7  | Naming BE vs FE mock?   | **BE strict** — FE sửa theo schema; xem [00-naming-conventions.md](./00-naming-conventions.md) |
| D8  | `visible` vs `active`?  | **`visible`** (catalog/booking); **`isActive`** (login) — tách rõ                              |

## Cần xác nhận

### Q1 — Slot conflict: salon-level hay per-staff?

**Hiện trạng:** `getAvailableSlotsForDate` block theo `date + time` toàn salon.

**Nếu** khách chọn nhân viên cụ thể: có cho 2 NV khác nhau cùng giờ không?

| Option       | Mô tả                                     |
| ------------ | ----------------------------------------- |
| A (đơn giản) | 1 slot = 1 booking cho cả salon (phase 1) |
| B            | Per-staff: cùng giờ, khác NV OK           |

**Khuyến nghị phase 1:** Option A — khớp logic mock hiện tại.

---

### Q2 — `lastName` booking customer

Bạn yêu cầu **bắt buộc**; mock schema hiện **optional**.

**Đề xuất:** Required — cập nhật Zod + UI khi FE follow BE.

---

### Q3 — Multi-service duration

Chọn nhiều dịch vụ: slot block theo tổng `estimatedMinutes` hay chỉ 1 time point?

**Mock:** chỉ block `time` string, không block các slot liên tiếp.

**Phase 1:** giữ mock behavior. Phase 1.1 có thể block N slot liên tiếp.

---

### Q4 — Staff job title (`role` trong mock)

Mock có `role: "Lead Nail Artist"`. Yêu cầu mới có `specialties[]`.

**Đề xuất:** Bỏ field `role` riêng; gộp vào `specialties`.

---

### Q5 — Admin tạo booking có cần bypass slot check?

**Đề xuất:** Không bypass — admin cũng phải chọn slot available (tránh double book).

---

### Q6 — Tiền tệ & locale

`price` lưu number — đơn vị VND hay USD?

**Đề xuất:** VND integer; format ở UI qua i18n.

---

### Q7 — Seed categories cố định hay dynamic?

Mock có 6 categories cố định. Admin có thể thêm/xóa category mới?

**Thiết kế:** Dynamic CRUD — seed 6 categories ban đầu từ mock.

---

### Q8 — Staff portal scope

Staff đăng nhập xem gì?

| Option   | Scope                         |
| -------- | ----------------------------- |
| Minimal  | Chỉ booking `staffId = me`    |
| Extended | + booking `any` (chưa assign) |

**Đề xuất Extended** — giúp NV thấy lịch salon liên quan.

---

### Q9 — `/admin/shifts`

Stitch mock có `admin-shifts.html` nhưng **không có code**. Phase 1 **out of scope** (per-staff shifts).

---

## Rủi ro kỹ thuật

| Rủi ro                             | Mitigation                                                                  |
| ---------------------------------- | --------------------------------------------------------------------------- |
| Race condition 2 booking cùng slot | Transaction / unique compound index `(date, time, status)` partial upcoming |
| Serverless cold start + Mongo      | Connection cache (đã có)                                                    |
| Auth.js beta                       | Pin version; theo dõi changelog                                             |
| Timezone off-by-one                | Salon TZ env + test cases                                                   |

---

## Sau khi xác nhận

1. Review docs trong `docs/system-design/`
2. Chạy `/opsx-propose` với tên **`salon-platform-backend`**
3. Proposal tham chiếu docs này làm design input
4. Superpowers implement theo tasks
