# Averie — System Design

Tài liệu thiết kế hệ thống trước khi triển khai qua OpenSpec + Superpowers.

## Mục đích

Mô tả kiến trúc, domain model, luồng nghiệp vụ và quy ước API cho nền tảng đặt lịch salon Averie — chuyển từ **UI prototype (mock in-memory)** sang **backend thật (MongoDB + Auth.js)**.

## Phạm vi phase này

| Trong phạm vi                                 | Ngoài phạm vi (phase sau)          |
| --------------------------------------------- | ---------------------------------- |
| Booking công khai (khách không cần đăng nhập) | Thanh toán / deposit               |
| Admin: xem, hủy, khôi phục booking            | Duyệt booking (approval workflow)  |
| CRUD dịch vụ + phân loại                      | Multi-location / chi nhánh         |
| CRUD nhân viên + tài khoản do admin tạo       | OAuth / SSO bên thứ ba             |
| Cấu hình lịch làm việc salon                  | Lịch riêng từng nhân viên (shifts) |
| Auth admin + staff (Credentials + JWT)        | Thông báo email/SMS                |
| Staff portal đăng nhập bằng tài khoản         | Client account / lịch sử booking   |

## Quy tắc naming (strict)

**Backend schema là nguồn sự thật.** Collection và field dùng tên canonical tốt nhất (xem [00-naming-conventions.md](./00-naming-conventions.md)). FE mock hiện tại sẽ **sửa theo BE sau** — không alias / mapper để giữ tên cũ (`active`, `durationMin`, `name`, …).

## Tài liệu trong thư mục

| File                                                     | Nội dung                                   |
| -------------------------------------------------------- | ------------------------------------------ |
| [00-naming-conventions.md](./00-naming-conventions.md)   | **Strict** — collections, fields, BE-first |
| [01-architecture.md](./01-architecture.md)               | Stack, layers, deployment                  |
| [02-domain-models.md](./02-domain-models.md)             | Entities MongoDB, quan hệ, indexes         |
| [03-booking.md](./03-booking.md)                         | Luồng đặt lịch khách hàng                  |
| [04-services.md](./04-services.md)                       | Phân loại & dịch vụ                        |
| [05-staff.md](./05-staff.md)                             | Nhân viên & tài khoản                      |
| [06-settings-schedule.md](./06-settings-schedule.md)     | Cấu hình salon & slot thời gian            |
| [07-admin-bookings.md](./07-admin-bookings.md)           | Quản lý booking phía admin                 |
| [08-auth.md](./08-auth.md)                               | Đăng nhập admin/staff                      |
| [09-api-actions.md](./09-api-actions.md)                 | Route Handlers, Server Actions, services   |
| [10-migration-from-mock.md](./10-migration-from-mock.md) | Mapping mock UI → backend                  |
| [11-open-questions.md](./11-open-questions.md)           | Quyết định còn mở                          |

## Trạng thái hiện tại (baseline)

```
┌─────────────────────────────────────────────────────────────┐
│                     HIỆN TẠI (MOCK)                        │
├─────────────────────────────────────────────────────────────┤
│  UI booking + admin  ──►  salon.service.ts (TanStack)       │
│                              │                               │
│                              ▼                               │
│                    mocks/salon/data.ts (in-memory)           │
│                                                              │
│  Admin auth  ──► sessionStorage flag                         │
│  Client auth ──► Auth.js stub (chưa nối booking)           │
│  MongoDB     ──► chỉ Todo model (demo)                       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     MỤC TIÊU (PHASE 1)                       │
├─────────────────────────────────────────────────────────────┤
│  UI (giữ nguyên) ──► @services ──► GET /api/*               │
│                         │                                    │
│                         └──► Server Actions (mutations)       │
│                                   │                          │
│                                   ▼                          │
│                         Mongoose models → MongoDB Atlas       │
│                         Auth.js Credentials → User collection│
└─────────────────────────────────────────────────────────────┘
```

## Gợi ý tên OpenSpec change (propose)

Khi sẵn sàng `/opsx-propose`, đề xuất dùng một trong các tên sau:

| Tên                          | Ý nghĩa                                      | Khuyến nghị                            |
| ---------------------------- | -------------------------------------------- | -------------------------------------- |
| **`salon-platform-backend`** | Toàn bộ backend domain salon (auth, DB, API) | **Khuyến nghị** — rõ scope, dễ archive |
| `wire-salon-backend`         | Nối UI mock sang backend thật                | Ngắn gọn, nhấn mạnh migration          |
| `core-booking-persistence`   | Tập trung booking + MongoDB                  | Hẹp hơn, thiếu auth/services           |

**Đề xuất chính:** `salon-platform-backend`

## Liên quan

- [docs/overview.md](../overview.md) — convention dự án
- [openspec/config.yaml](../../openspec/config.yaml) — context AI + backend rules
- UI reference: `docs/stitch/` (Stitch mockups)
