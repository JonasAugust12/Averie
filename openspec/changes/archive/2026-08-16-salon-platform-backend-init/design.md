## Context

Averie UI (Stitch port) runs on **in-memory mocks** (`src/mocks/salon/data.ts`, `salon.service.ts`). MongoDB connection exists (`src/libs/mongodb.ts`) with a demo `Todo` model only. Auth.js scaffold exists but salon admin/staff login is mock/sessionStorage.

System design docs (`docs/system-design/`) define the target backend: 5 MongoDB collections, strict canonical naming, GET reads via Route Handlers, mutations via Server Actions, Auth.js Credentials + JWT.

**This change**: implement backend + API docs only. UI continues using mocks until a later wire-up change.

## Goals / Non-Goals

**Goals:**

- Mongoose models + Zod schemas for all salon domain entities
- Seed script: admin user, `salon_settings` singleton, 6 default categories (+ optional sample services)
- Auth.js Credentials against `users` with bcrypt; role-aware session (`admin` | `staff`)
- All GET endpoints and Server Actions listed in `docs/system-design/09-api-actions.md`
- Shared server logic: slot availability, booking conflict check, reference generation (`AV-{YYYYMMDD}-{seq4}`)
- API documentation: next-openapi-gen (GET routes) + manual fragments (Server Actions) + Scalar at `/api/docs`
- `ENABLE_API_DOCS` env; docs return 404 when disabled

**Non-goals:**

- Refactoring UI, `@services/salon.service.ts`, or removing mocks
- Payment, notifications, OAuth, multi-location, per-staff shifts
- Customer login / booking history accounts
- Automated E2E tests (manual verification OK)
- zsa-openapi REST bridges for Server Actions

## Decisions

### D1 — Data layer: Mongoose 8 on MongoDB Atlas

Reuse existing `connectToDatabase()` cache pattern. Collection names snake_case plural per `00-naming-conventions.md`.

### D2 — Validation: Zod 4 mirrors in `@validations/*`

Server Actions call `parseActionInput()` before DB writes. Route Handlers validate query params with Zod where applicable.

### D3 — Mapper: `src/mappers/` (`@mappers`)

Per-entity serialize helpers (`user.mapper.ts`, `service.mapper.ts`, …) plus `shared.mapper.ts`. Only `_id` → `id`, Date → ISO string, strip `passwordHash`. No mock field aliasing.

### D4 — Booking slot logic

Reuse `schedule.util.ts` logic via `src/libs/schedule.server.ts` wrapper. Phase 1: **salon-level** conflict — one `upcoming` booking per `date + time`. Multi-service blocks single time point only (not consecutive slots).

Mitigate race: partial unique index on `(date, time)` where `status === 'upcoming'` OR transactional check in `createBookingAction`.

### D5 — Auth

- Add `bcryptjs` for password hashing
- `authorize()` in Auth.js config queries `User` by email, checks `isActive`, compares hash
- Admin-only actions check `session.user.role === 'admin'`
- Staff actions allow `staff` role where specified (staff calendar reads)

### D6 — API documentation stack

| Piece          | Choice                           | Rationale                                   |
| -------------- | -------------------------------- | ------------------------------------------- |
| Spec generator | `next-openapi-gen`               | App Router + Zod 4 native; scans `route.ts` |
| UI             | `@scalar/nextjs-api-reference`   | Next 15 compatible, modern UX               |
| Server Actions | `openapi/fragments/actions.yaml` | Doc-only pseudo-paths; no HTTP bridge       |
| Gating         | `ENABLE_API_DOCS=1`              | Explicit opt-in; prod unset → 404           |

Routes:

- `GET /api/openapi.json` — merged spec
- `GET /api/docs` — Scalar UI

### D7 — File layout (target)

```text
src/models/           user, service-category, service, booking, salon-settings
src/validations/      mirror schemas per entity
src/mappers/          per-entity DTO serializers (@mappers)
src/libs/             booking.service, schedule.server, auth-guard, mongo-dns
src/actions/          booking, service, service-category, staff, schedule-settings, auth
src/app/api/          all GET handlers from 09-api-actions.md
openapi/              fragments for Server Actions
scripts/              seed-salon.mjs (or ts)
```

### D8 — Dependencies to add

- `bcryptjs`, `@types/bcryptjs` (dev)
- `next-openapi-gen` (dev)
- `@scalar/nextjs-api-reference`

## Risks / Trade-offs

| Risk                                  | Mitigation                                                          |
| ------------------------------------- | ------------------------------------------------------------------- |
| Race: double booking same slot        | Partial unique index + 409 on conflict in action                    |
| Auth.js beta drift                    | Pin `next-auth@5.0.0-beta.32`; test login after DB wiring           |
| OpenAPI fragments drift from code     | Reference same Zod schema exports in fragment `$ref` where possible |
| Server Actions not "Try it" in Scalar | Acceptable — docs are read-only reference                           |
| Zod 4 + next-openapi-gen edge cases   | Spike during docs task; fallback to explicit `@response` JSDoc      |

## Migration Plan

1. Deploy with empty DB → run seed script once per environment
2. Existing UI unaffected (still mocks)
3. Follow-up change: wire `@services` to real API/actions + FE naming migration
4. Rollback: revert code; Mongo collections can remain (no UI dependency yet)

## Open Questions

- Seed admin password: generated on first seed, printed once to console (not in repo)
- `GET /api/admin/kpis`: optional — implement if time permits in apply phase, else defer
