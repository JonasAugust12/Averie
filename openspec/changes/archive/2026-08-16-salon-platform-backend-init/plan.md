# Salon Platform Backend Init — Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development
> to implement this plan task-by-task. Do **not** wire UI in this change.

**Goal:** Persist salon domain in MongoDB, expose GET Route Handlers and Server Actions per `docs/system-design/`, and ship dev-only Scalar API docs — without changing mock-backed UI.

**Architecture:** Mongoose models + Zod validation + thin mappers; business logic in `booking.service.ts` / `schedule.server.ts`; reads in `src/app/api/**`, mutations in `src/actions/**`; OpenAPI via next-openapi-gen + YAML fragments.

**Tech Stack:** Next.js 15 App Router, Mongoose 8, Zod 4, Auth.js v5 Credentials, bcryptjs, next-openapi-gen, @scalar/nextjs-api-reference.

**Refs:** `brainstorm.md`, `design.md`, `proposal.md`, `specs/*`, `tasks.md`, `docs/system-design/*`.

---

## File map (expected)

| Path                                | Responsibility                 |
| ----------------------------------- | ------------------------------ |
| `src/models/*.model.ts`             | Mongoose schemas + indexes     |
| `src/validations/*.schema.ts`       | Zod input/output mirrors       |
| `src/mappers/*.mapper.ts`           | DTO serialization (`@mappers`) |
| `src/libs/booking.service.ts`       | Reference, conflict, totals    |
| `src/libs/schedule.server.ts`       | Server slot availability       |
| `src/actions/*.action.ts`           | Mutations                      |
| `src/app/api/**/route.ts`           | GET handlers                   |
| `openapi/fragments/actions.yaml`    | Server Action docs             |
| `scripts/seed-salon.mjs`            | Initial data                   |
| `src/app/api/openapi.json/route.ts` | Spec endpoint                  |
| `src/app/api/docs/route.ts`         | Scalar UI                      |

---

## Task 1: Dependencies and env

- [x] **Step 1:** `pnpm add bcryptjs` and `pnpm add -D @types/bcryptjs next-openapi-gen @scalar/nextjs-api-reference`
- [x] **Step 2:** Add `ENABLE_API_DOCS=0` to `.env.example`
- [x] **Step 3:** Set `ENABLE_API_DOCS=1` in local `.env.local` for docs testing
- [x] **Step 4:** `pnpm type-check` — confirm clean baseline

## Task 2: Mongoose models

- [x] **Step 1:** Create `service-category.model.ts` (`name`, `sortOrder`, timestamps)
- [x] **Step 2:** Create `service.model.ts` (`categoryId`, `price`, `estimatedMinutes`, `visible`, …)
- [x] **Step 3:** Create `user.model.ts` (`email` unique, `passwordHash`, `role`, staff fields, `isActive`)
- [x] **Step 4:** Create `booking.model.ts` (`reference` unique, `customer`, `staffPreference`, indexes)
- [x] **Step 5:** Create `salon-settings.model.ts` (singleton fields from design doc)
- [x] **Step 6:** Export models from `@models` index if pattern exists
- [x] **Step 7:** Commit: `feat(db): add salon mongoose models`

## Task 3: Zod schemas + mapper

- [x] **Step 1:** Add validation schemas mirroring each entity (create/update variants)
- [x] **Step 2:** Implement `src/mappers/*.mapper.ts` with serialize helpers per entity
- [x] **Step 3:** Unit-check mapper output uses `visible`, `estimatedMinutes`, `id`
- [x] **Step 4:** Commit: `feat(db): add salon zod schemas and mapper`

## Task 4: Seed script

- [x] **Step 1:** Create `scripts/seed-salon.mjs` using `connectToDatabase`
- [x] **Step 2:** Upsert admin user with bcrypt hash; log temp password once
- [x] **Step 3:** Upsert default `salon_settings` from mock schedule shape
- [x] **Step 4:** Insert 6 categories from mock ids/names
- [x] **Step 5:** Add `"db:seed": "node --env-file=.env.local scripts/seed-salon.mjs"` to package.json
- [x] **Step 6:** Run seed locally; verify via MongoDB
- [x] **Step 7:** Commit: `feat(db): add salon seed script`

## Task 5: Shared booking/schedule logic

- [x] **Step 1:** Implement `schedule.server.ts` — load settings + bookings, call util
- [x] **Step 2:** Implement `booking.service.ts` — `generateReference()`, `checkSlotConflict()`, `computeTotals(serviceIds)`
- [x] **Step 3:** Add partial unique index or explicit conflict query
- [x] **Step 4:** Commit: `feat(db): add booking and schedule server logic`

## Task 6: Auth wiring

- [x] **Step 1:** Update `auth.config.ts` `authorize()` — find user, bcrypt compare, check `isActive`
- [x] **Step 2:** JWT/session callbacks include `role`, `id`
- [x] **Step 3:** Add `requireAdmin(session)` / `requireStaffOrAdmin(session)` in `@libs`
- [x] **Step 4:** Update `loginAction` / `logoutAction` if needed
- [x] **Step 5:** Manual test: seed admin → `loginAction` succeeds
- [x] **Step 6:** Commit: `feat(auth): wire credentials to mongodb users`

## Task 7: Public GET handlers

- [x] **Step 1:** `service-categories/route.ts` — list with nested services optional
- [x] **Step 2:** `services/route.ts`, `staff/route.ts` (`?visible=true`), `settings/schedule/route.ts`
- [x] **Step 3:** `bookings/slots/route.ts` — query validation, call schedule.server
- [x] **Step 4:** `bookings/by-reference/route.ts`
- [x] **Step 5:** JSDoc openapi tags on each handler
- [x] **Step 6:** Manual curl smoke tests
- [x] **Step 7:** Commit: `feat(api): add public salon read endpoints`

## Task 8: Admin GET handlers

- [x] **Step 1:** `bookings/route.ts` — pagination, filters, admin guard
- [x] **Step 2:** `bookings/[id]/route.ts`
- [x] **Step 3:** `staff/[id]/bookings/route.ts`
- [x] **Step 4:** (Optional) `admin/kpis/route.ts`
- [x] **Step 5:** Commit: `feat(api): add admin salon read endpoints`

## Task 9: Booking actions

- [x] **Step 1:** `booking.action.ts` — `createBookingAction`
- [x] **Step 2:** `cancelBookingAction`, `restoreBookingAction`
- [x] **Step 3:** Test create + 409 conflict + cancel/restore manually
- [x] **Step 4:** Commit: `feat(action): add booking server actions`

## Task 10: Services + staff + settings actions

- [x] **Step 1:** `service-category.action.ts` — CRUD
- [x] **Step 2:** `service.action.ts` — CRUD + toggle visibility
- [x] **Step 3:** `staff.action.ts` — CRUD + reset password (bcrypt)
- [x] **Step 4:** `schedule-settings.action.ts` — update singleton
- [x] **Step 5:** Commit: `feat(action): add admin crud server actions`

## Task 11: API documentation

- [x] **Step 1:** Run `pnpm exec openapi-gen init` (or manual config) for App Router + Zod
- [x] **Step 2:** Create `openapi/fragments/actions.yaml` listing all Server Actions
- [x] **Step 3:** `src/app/api/openapi.json/route.ts` — merge gen + fragments; gate `ENABLE_API_DOCS`
- [x] **Step 4:** `src/app/api/docs/route.ts` — Scalar `ApiReference`; gate `ENABLE_API_DOCS`
- [x] **Step 5:** Verify `/api/docs` in dev; 404 when disabled
- [x] **Step 6:** Commit: `feat(docs): add scalar api reference with env gate`

## Task 12: Final verification

- [x] **Step 1:** `pnpm type-check`
- [x] **Step 2:** `pnpm lint` (if broad touch)
- [x] **Step 3:** Document seed + docs usage in README snippet (optional one paragraph)
- [x] **Step 4:** Confirm `salon.service.ts` and mocks untouched

---

## Apply notes

- **Do not** refactor UI or `@services/salon.service.ts` in this change
- **Automated E2E/unit tests** deferred per non-goals — manual smoke + `pnpm type-check` / `pnpm lint` only
- Follow canonical naming from `docs/system-design/00-naming-conventions.md`
- All responses use `{ status, message, data }` envelope
- GET = Route Handler; mutations = Server Action only
