# Averie

Next.js (App Router) full-stack app — **frontend + serverless API** in one project, ready for **Vercel**. Stack mirrors `bkb-storage-ticket-app` on the client side.

## Stack

| Layer        | Tech                                                  |
| ------------ | ----------------------------------------------------- |
| Framework    | Next.js 15 (App Router)                               |
| UI           | React 19, Tailwind CSS 4, Lucide                      |
| State / data | Zustand, TanStack Query, Axios                        |
| i18n         | next-intl (`vi` / `en`)                               |
| Backend      | Route Handlers (`src/app/api/*`) on Vercel serverless |
| DB           | MongoDB Atlas via Mongoose (cached connection)        |

## Path aliases

| Alias           | Folder                                         |
| --------------- | ---------------------------------------------- |
| `@services/*`   | `src/services/*` (client TanStack/Axios)       |
| `@components/*` | `src/components/*`                             |
| `@hooks/*`      | `src/hooks/*`                                  |
| `@i18n/*`       | `src/i18n/*`                                   |
| `@libs/*`       | `src/libs/*`                                   |
| `@messages/*`   | `messages/*`                                   |
| `@models/*`     | `src/models/*`                                 |
| `@providers/*`  | `src/providers/*`                              |
| `@stores/*`     | `src/stores/*`                                 |
| `@typings/*`    | `src/types/*` (`@types` bị TypeScript reserve) |
| `@utils/*`      | `src/utils/*`                                  |
| `@/*`           | `src/*` (fallback)                             |

Example: `import { Button } from '@components/common'`

## Layout & theme

- `AppShell` caps content at **1280px** (`max-w-[1280px]`) centered on large screens.
- Design tokens: Primary `#2B2623`, Secondary `#D4C5B9`, Tertiary `#F5EFEA`, Neutral `#FDFCFB`.
- Fonts: **Playfair Display** (headlines) + **Inter** (body/labels).
- Buttons: `primary` / `secondary` / `inverted` / `outlined` in `@components/common/Button`.

## Project structure

```text
src/
  app/                 # Pages + Route Handlers
    api/               # Serverless backend (/api/*) — giữ tên `api` theo Next.js
      health/          # GET /api/health
      todos/           # GET/POST /api/todos, PATCH/DELETE /api/todos/:id
  services/            # Client services (TanStack Query + Axios → /api/*)
  components/          # UI components (layout/AppShell, common/Button, ...)
  i18n/                # next-intl config + messages wiring
  libs/
    api-client.ts      # Axios instance
    mongodb.ts         # Cached Mongoose connection (serverless-safe)
    query-client.ts
  models/              # Mongoose models
  providers/           # QueryProvider, I18nProvider
  stores/              # Zustand stores
  types/
  utils/
messages/              # vi + en translation JSON
```

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
