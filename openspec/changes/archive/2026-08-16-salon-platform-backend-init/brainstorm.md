## Design Summary

Implement **phase 1 salon backend** for Averie: MongoDB persistence (Mongoose 8), Zod-validated Server Actions for mutations, GET Route Handlers for reads, Auth.js Credentials backed by `users` collection, and dev-only API documentation (next-openapi-gen + Scalar). **Do not wire UI** in this change — keep existing mock-backed `@services` and components; backend is callable and documented for a follow-up wire-up change.

Design input: `docs/system-design/*` (canonical BE-first naming: `visible`, `estimatedMinutes`, `firstName`/`lastName`, etc.).

## Alternatives Considered

### Alternative A: Full backend + wire UI in one change

- **Approach**: Models, API, actions, and refactor `salon.service.ts` + admin screens to real data in a single PR.
- **Pros**: End-to-end demo immediately; fewer intermediate states.
- **Cons**: Large blast radius; mixes BE naming migration with UI regressions; harder to review.
- **Why not chosen**: User explicitly wants backend first without UI connection.

### Alternative B: Backend-only + hybrid API docs (chosen)

- **Approach**: Implement models, validations, GET handlers, Server Actions per `09-api-actions.md`; add next-openapi-gen for GET routes + manual OpenAPI fragments for Server Actions; Scalar UI gated by `ENABLE_API_DOCS=1`.
- **Pros**: Matches Averie architecture rules; readable docs for future work; isolated review surface.
- **Cons**: Manual fragment maintenance for actions; no interactive "Try it" for mutations in Swagger.
- **Why not chosen**: N/A — agreed path.

### Alternative C: zsa-openapi REST bridge for Server Actions

- **Approach**: Expose every mutation as additional Route Handlers for auto OpenAPI.
- **Pros**: Full auto-generated Swagger including mutations.
- **Cons**: Violates project rule (POST/PUT/PATCH/DELETE → Server Actions only); duplicate entry points.
- **Why not chosen**: Conflicts with `AGENTS.md` / `openspec/config.yaml` backend rules.

## Agreed Approach

**Alternative B**, refined:

1. **Persistence**: 5 collections (`service_categories`, `services`, `users`, `bookings`, `salon_settings`) + seed (admin user, default settings, 6 categories from mock).
2. **API layer**: ~12 GET Route Handlers + ~15 Server Actions; unified `{ status, message, data }` envelope.
3. **Auth**: bcrypt + Auth.js `authorize()` against MongoDB; middleware for `/admin/*` and `/staff/*` (follow-up within scope).
4. **Booking rules (phase 1 defaults from open questions)**: salon-level slot conflict (Option A); VND integer prices; customer `lastName` required; no admin slot bypass.
5. **Docs**: next-openapi-gen + `@scalar/nextjs-api-reference`; `/api/openapi.json` + `/api/docs`; `ENABLE_API_DOCS` in `.env.example`; 404 when disabled.
6. **Non-goals**: UI wiring, payment, email/SMS, OAuth, per-staff shifts, customer accounts, removing mock layer.

## Key Decisions

- **Mongoose 8** (not TypeORM) — already in repo; see `docs/system-design/01-architecture.md`.
- **Staff in `users` collection** with `role: 'staff'` — no separate Staff collection.
- **BE-first naming** — no mock field aliases in mappers (`visible` not `active`).
- **OpenAPI for GET auto; Server Actions via YAML fragments** — documentation-only pseudo-paths under tag `Server Actions`.
- **Scalar over Swagger UI classic** — modern Next 15 integration; user confirmed.
- Open questions resolved per design doc recommendations (Q1–Q8 in `11-open-questions.md`).

## Open Questions

- Dev seed admin credentials (email/password) — default `admin@averie.local` + documented temp password in seed script README comment only (not committed secrets).
- Timezone env for salon (`SALON_TIMEZONE`) — defer unless slot bugs appear; use server local + `YYYY-MM-DD` strings initially.
