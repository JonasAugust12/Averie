# 04 — Services (Phân loại & Dịch vụ)

## 1. Phạm vi admin

Route: `/admin/services`  
Components: `src/components/admin/services/*`

Admin có thể:

- Xem dịch vụ theo phân loại
- Thêm / sửa / xóa **phân loại** (chỉ tên)
- Thêm / sửa / xóa **dịch vụ** trong phân loại
- Toggle **visible** (ẩn/hiện trên booking public)

## 2. Entity summary

### ServiceCategory

| Field     | UI             | Admin form                           |
| --------- | -------------- | ------------------------------------ |
| name      | Section header | Text input                           |
| icon      | Badge icon     | Lucide icon picker (PascalCase name) |
| sortOrder | —              | Auto on create                       |

Category header actions: **Add service**, **Edit category**, **Delete category** (blocked when category still has services).

Invalid or missing Lucide icon names fall back to `Sparkles` in the UI.

### Service

| Field            | UI label (i18n)       | Validation         |
| ---------------- | --------------------- | ------------------ |
| name             | Tên dịch vụ           | required, max 120  |
| description      | Mô tả chi tiết        | required, max 2000 |
| price            | Giá                   | number >= 0        |
| estimatedMinutes | Thời gian ước tính    | integer > 0        |
| visible          | Hiển thị              | boolean toggle     |
| categoryId       | (implicit từ section) | required ObjectId  |

## 3. API design

### Reads (GET)

| Endpoint                      | Mô tả                                                                     | Auth                               |
| ----------------------------- | ------------------------------------------------------------------------- | ---------------------------------- |
| `GET /api/service-categories` | List categories + nested services (optional query `?includeHidden=false`) | Public cho booking; admin thấy all |
| `GET /api/services`           | Flat list, filter `?categoryId=&visible=`                                 | Public / Admin                     |

**Public booking** chỉ nhận `visible: true` services.

### Mutations (Server Actions)

| Action                          | Mô tả                                                     |
| ------------------------------- | --------------------------------------------------------- |
| `createServiceCategoryAction`   | Tạo category (name, sortOrder, icon)                      |
| `updateServiceCategoryAction`   | Sửa name / sortOrder / icon                               |
| `deleteServiceCategoryAction`   | Xóa nếu không còn service (409 khi category còn services) |
| `createServiceAction`           | Tạo service                                               |
| `updateServiceAction`           | Sửa service                                               |
| `deleteServiceAction`           | Xóa service                                               |
| `toggleServiceVisibilityAction` | PATCH-style toggle                                        |

Tất cả actions yêu cầu **admin session**.

## 4. UI mapping

Mock hiện tại:

- `ServiceFormModal` — form create/edit service
- `CategoryFormModal` — form create/edit category (name + Lucide icon)
- `ServiceCategorySection` — group by category; header có edit/delete category
- `ServiceCard` — card + edit/delete service
  Mock hiện tại dùng `active` — **BE dùng `visible`**. FE sửa label/form khi wire API (không alias ở server).

Fixed categories trong `mocks/salon/data.ts` (`SERVICE_CATEGORIES`) → seed script hoặc admin tạo mới.

## 5. Delete policy

| Entity   | Rule                                                                                                                             |
| -------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Category | Không xóa nếu `services.count > 0` — admin phải move/delete services trước                                                       |
| Service  | Soft-delete optional; phase 1 **hard delete** OK nếu chưa có booking ref. Nếu có booking historical → **chỉ toggle visible off** |

**Khuyến nghị:** không hard delete service đã xuất hiện trong booking — set `visible: false`.

## 6. TanStack hooks (`@services`)

Thay mock hooks trong `salon.service.ts`:

| Hook hiện tại (mock)   | Thay bằng                                                     |
| ---------------------- | ------------------------------------------------------------- |
| `useServices`          | `useQuery` → GET `/api/services`                              |
| `useSaveMockService`   | `useMutation` → `createServiceAction` / `updateServiceAction` |
| `useDeleteMockService` | `useMutation` → `deleteServiceAction`                         |

Tương tự cho categories (`useCreateServiceCategory`, `useUpdateServiceCategory`, `useDeleteServiceCategory`).

## 7. i18n

Category **name** lưu một ngôn ngữ (admin nhập) phase 1.  
Nếu cần đa ngôn ngữ sau: `{ name: { vi, en } }` — **ngoài phạm vi**.

## 8. Diagram

```
Admin UI (/admin/services)
        │
        ├── GET /api/service-categories?includeHidden=true
        │
        ├── createServiceCategoryAction ──▶ ServiceCategory collection
        ├── createServiceAction         ──▶ Service collection
        └── toggleServiceVisibilityAction

Public UI (/book step 1)
        │
        └── GET /api/services?visible=true
```
