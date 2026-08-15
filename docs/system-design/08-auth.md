# 08 — Authentication

## 1. Yêu cầu

- Đăng nhập **admin** và **staff** bằng email + mật khẩu
- **JWT session** (Auth.js) — bắt buộc với Credentials provider
- **Không** tích hợp OAuth / bên thứ ba phase 1
- Dùng **NextAuth v5** (đã có scaffold)

Khách đặt lịch **không cần** đăng nhập.

## 2. Kiến trúc auth

```
┌──────────────┐     loginAction      ┌─────────────────┐
│ Login UI     │ ───────────────────▶  │ signIn()        │
│ admin/staff  │                       │ Auth.js         │
└──────────────┘                       └────────┬────────┘
                                                │
                                                ▼
                                       authorize(credentials)
                                                │
                                                ▼
                                       User.findOne({ email })
                                       bcrypt.compare(password)
                                                │
                                                ▼
                                       JWT { id, email, role, name }
                                                │
                                                ▼
                                       Session cookie (httpOnly)
```

## 3. User roles

```typescript
type UserRole = 'admin' | 'staff';
```

| Role    | Login route           | Protected routes          |
| ------- | --------------------- | ------------------------- |
| `admin` | `/admin/login`        | `/admin/*` (except login) |
| `staff` | `/staff` (login view) | `/staff/*`                |

**JWT / Session payload:**

```typescript
session.user = {
    id: string,
    email: string,
    name: string, // firstName + lastName
    role: UserRole,
};
```

Augment `src/types/next-auth.d.ts`:

```typescript
interface User {
    role: UserRole;
}
interface Session {
    user: { role: UserRole };
}
```

## 4. authorize() flow (thay stub)

File: `src/libs/auth.config.ts`

```typescript
async authorize(credentials) {
  // 1. Zod parse email/password
  // 2. connectToDatabase()
  // 3. User.findOne({ email, isActive: true })
  // 4. bcrypt.compare
  // 5. return { id, email, name, role }
}
```

Remove hardcoded `demo@averie.local` stub sau seed admin thật.

## 5. Bootstrap admin

Seed script hoặc one-time setup:

```
email: admin@averie.local  (hoặc env ADMIN_EMAIL)
password: env ADMIN_INITIAL_PASSWORD
role: admin
```

Chạy local / CI deploy — không commit password.

## 6. Login / logout

| Flow        | Implementation                                                    |
| ----------- | ----------------------------------------------------------------- |
| Admin login | `loginAction` → `signIn('credentials', { redirectTo: '/admin' })` |
| Staff login | Same action, `redirectTo: '/staff'`                               |
| Logout      | `logoutAction` → `signOut()`                                      |

Replace **mock** `sessionStorage` admin auth trong `booking.store.ts` / `AdminShell.tsx`.

## 7. Route protection

**Middleware** `src/middleware.ts` (mới):

```typescript
// Pseudocode
if (path.startsWith('/admin') && !path.startsWith('/admin/login')) {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') redirect('/admin/login');
}

if (path.startsWith('/staff')) {
    const session = await auth();
    if (!session?.user || session.user.role !== 'staff') redirect('/staff?login=1');
}
```

Giữ `/api/auth/[...nextauth]` — Auth.js protocol bắt buộc.

## 8. Server-side authorization

Mọi Server Action và sensitive GET phải check role:

```typescript
const session = await auth();
if (!session?.user || session.user.role !== 'admin') {
    return apiErrorResult(401, 'Unauthorized');
}
```

Staff actions: chỉ đọc booking liên quan.

## 9. Client auth hooks

Existing: `src/services/auth.service.ts`

- `useLogin`, `useLogout`, `useAuthSession`
- Wire admin/staff login forms to `loginAction`

## 10. Security checklist

| Item                 | Phase 1             |
| -------------------- | ------------------- |
| bcrypt password hash | ✓                   |
| JWT httpOnly cookie  | ✓ (Auth.js default) |
| CSRF (Auth.js)       | ✓                   |
| Rate limit login     | Optional            |
| Password policy      | min 8 chars Zod     |
| Staff password reset | Admin only          |

## 11. Loại bỏ mock auth

| Mock hiện tại                        | Thay bằng                         |
| ------------------------------------ | --------------------------------- |
| `isAdminMockAuthed()` sessionStorage | Auth.js session                   |
| `setAdminMockAuthed()`               | `loginAction`                     |
| Staff phone lookup                   | Credentials login                 |
| `(user)/login` demo redirect         | Optional — không dùng cho booking |

## 12. Diagram — dual portal

```
                 ┌─────────────────────┐
                 │   Auth.js (shared)   │
                 │   Credentials JWT    │
                 └──────────┬──────────┘
                            │
            ┌───────────────┴───────────────┐
            ▼                               ▼
     role: admin                       role: staff
     /admin/login                      /staff login
            │                               │
            ▼                               ▼
     AdminShell gate                 Staff portal
     CRUD all                         View own schedule
```
