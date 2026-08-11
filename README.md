# Averie

Next.js (App Router) full-stack app — **frontend + serverless API** in one project, ready for **Vercel**. Stack mirrors `bkb-storage-ticket-app` on the client side.

Tổng quan kiến trúc & rules: [`docs/overview.md`](./docs/overview.md).  
Quy trình nâng cao (OpenSpec / Superspec): [`docs/advanced-workflow.md`](./docs/advanced-workflow.md).  
Stitch → code + iterate UI: [`docs/working-with-stitch.md`](./docs/working-with-stitch.md).

## Stack

| Layer        | Tech                                                 |
| ------------ | ---------------------------------------------------- |
| Framework    | Next.js 15 (App Router)                              |
| UI           | React 19, Tailwind CSS 4, Lucide                     |
| State / data | Zustand, TanStack Query, Axios, react-hook-form, Zod |
| i18n         | next-intl (`vi` / `en`)                              |
| CRUD         | Server Actions (`src/actions/*`)                     |
| External SVC | Route Handlers (`src/app/api/*`)                     |
| Auth         | Auth.js (`next-auth` v5) — Credentials local stub    |

## Path aliases

| Alias            | Folder                                         |
| ---------------- | ---------------------------------------------- |
| `@actions/*`     | `src/actions/*` (Server Actions — CRUD)        |
| `@services/*`    | `src/services/*` (client TanStack hooks)       |
| `@validations/*` | `src/validations/*` (Zod schemas)              |
| `@components/*`  | `src/components/*`                             |
| `@hooks/*`       | `src/hooks/*`                                  |
| `@i18n/*`        | `src/i18n/*`                                   |
| `@libs/*`        | `src/libs/*`                                   |
| `@messages/*`    | `messages/*`                                   |
| `@models/*`      | `src/models/*`                                 |
| `@providers/*`   | `src/providers/*`                              |
| `@stores/*`      | `src/stores/*`                                 |
| `@typings/*`     | `src/types/*` (`@types` bị TypeScript reserve) |
| `@utils/*`       | `src/utils/*`                                  |
| `@/*`            | `src/*` (fallback)                             |

Example: `import { Button } from '@components/common'`

## Layout & theme

- `AppShell` caps content at **1280px** (`max-w-[1280px]`) centered on large screens.
- Design tokens: Primary `#2B2623`, Secondary `#D4C5B9`, Tertiary `#F5EFEA`, Neutral `#FDFCFB`.
- Fonts: **Playfair Display** (headlines) + **Inter** (body/labels).
- Buttons: `primary` / `secondary` / `inverted` / `outlined` in `@components/common/Button`.

## Project structure

```text
src/
  actions/             # Server Actions — internal CRUD
    todo.action.ts
  app/
    api/               # Route Handlers — external SVC / webhooks / health
      health/          # GET /api/health
  services/            # Client TanStack hooks → actions hoặc axios(/api)
  validations/         # Zod schemas (share FE form + Server Action)
  components/
  i18n/
  libs/
    action.util.ts     # ActionResult helpers + unwrap
    api-client.ts      # Axios (external /api)
    mongodb.ts
    query-client.ts
  models/
  providers/
  stores/
  types/
  utils/
messages/
```

## Backend convention

| Operation                            | Pattern        | Folder          |
| ------------------------------------ | -------------- | --------------- |
| **GET** (reads)                      | Route Handlers | `src/app/api/*` |
| **POST / PUT / PATCH / DELETE**      | Server Actions | `src/actions/*` |
| External SVC / webhooks / public API | Route Handlers | `src/app/api/*` |

### Unified response envelope

Mọi API (và Server Action) trả về cùng shape:

```json
{
    "status": 200,
    "message": "OK",
    "data": {}
}
```

- `status` — HTTP code (200, 201, 400, 404, 500…)
- `message` — mô tả ngắn
- `data` — payload hoặc `null` khi lỗi

Helpers:

- Route Handlers: `apiSuccess` / `apiError` trong `src/app/api/_lib/http.ts`
- Server Actions: `apiSuccessResult` / `apiErrorResult` trong `src/libs/action.util.ts`
- Client unwrap: `unwrapApiResponse()`

Flow GET: `UI → @services → Axios → GET /api/* → MongoDB / external`  
Flow mutate: `UI → @services → Server Action → MongoDB`

## Auth (Auth.js v5)

Scaffold Credentials (local) — chưa nối DB.

| File                                      | Role                                    |
| ----------------------------------------- | --------------------------------------- |
| `src/libs/auth.config.ts`                 | Providers + JWT/session callbacks       |
| `src/libs/auth.ts`                        | `handlers`, `auth`, `signIn`, `signOut` |
| `src/app/api/auth/[...nextauth]/route.ts` | Auth.js HTTP endpoints (bắt buộc)       |
| `src/actions/auth.action.ts`              | `loginAction` / `logoutAction`          |
| `src/services/auth.service.ts`            | Client hooks                            |
| `src/providers/AuthProvider.tsx`          | `SessionProvider`                       |

Demo stub:

- email: `demo@averie.local`
- password: `password`

Thêm `AUTH_SECRET` vào `.env.local` trước khi chạy.

## Tooling (giống bkb)

- EditorConfig + Prettier (4 spaces, LF) + ESLint
- Husky: `commit-msg` (commitlint), `pre-commit` (lint-staged), `pre-push` (lint + format check)
- GitHub Actions: `.github/workflows/lint.yml`, `commit-lint.yml`
- Conventional commits: `feat|fix|docs|style|refactor|perf|test|chore|revert`

## Quick start

```bash
pnpm install
cp .env.example .env.local
# Edit .env.local → set MONGODB_URI
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The home page calls `/api/health` and can create demo todos in MongoDB.

## MongoDB Atlas (first time)

1. Sign up at [cloud.mongodb.com](https://cloud.mongodb.com) → create a **free M0** cluster.
2. **Database Access** → create a DB user + password.
3. **Network Access** → add `0.0.0.0/0` (Allow Access from Anywhere). Vercel functions use dynamic IPs; this is the usual serverless setup.
4. **Connect** → Drivers → copy the `mongodb+srv://...` URI into `.env.local` as `MONGODB_URI`.
5. Put a database name in the path, e.g. `...mongodb.net/averie?retryWrites=true&w=majority`.

How it works on Vercel:

- Each API request runs as a short-lived Node serverless function.
- `connectToDatabase()` in `src/libs/mongodb.ts` **reuses** a global connection across warm invocations (standard Mongoose/Lambda pattern).
- Never expose `MONGODB_URI` to the browser — only use it inside Route Handlers / Server Components.

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import the project on [vercel.com](https://vercel.com).
3. Add env vars from `.env.example` (`MONGODB_URI`, `NEXT_PUBLIC_APP_URL`).
4. Deploy — FE pages and `/api/*` ship together on the same domain.

```bash
pnpm build   # optional local production check
```

## Scripts

| Command           | Description          |
| ----------------- | -------------------- |
| `pnpm dev`        | Dev server           |
| `pnpm build`      | Production build     |
| `pnpm start`      | Run production build |
| `pnpm lint`       | ESLint               |
| `pnpm type-check` | TypeScript           |
