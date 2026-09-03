# AGENTS.md — Averie

Guidance for AI agents working in this repo.

## Project

Averie is a Next.js 15 (App Router) full-stack app deployed on Vercel serverless.
Docs: `docs/overview.md`, `docs/backend-conventions.md`, `docs/advanced-workflow.md`, `docs/superpowers.md`.

## Commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm type-check
pnpm format
pnpm format:check
```

OpenSpec:

```bash
openspec schemas
openspec validate
openspec status
```

Default schema: **superspec** (`openspec/config.yaml`).

## Architecture rules (non-negotiable)

| Concern                     | Rule                                                   |
| --------------------------- | ------------------------------------------------------ |
| GET / reads                 | Route Handlers → `src/app/api/**`                      |
| POST / PUT / PATCH / DELETE | Server Actions → `src/actions/**`                      |
| External SVC / webhooks     | Route Handlers → `src/app/api/**`                      |
| Response shape              | `{ status: number, message: string, data: T \| null }` |
| Auth UI login/logout        | Server Actions wrapping Auth.js `signIn` / `signOut`   |
| Auth.js HTTP                | Keep `src/app/api/auth/[...nextauth]`                  |

Client data layer: `@services/*` (TanStack Query) calls either `apiClient` (GET) or actions (mutations).

## Aliases

Use `@actions`, `@services`, `@validations`, `@components`, `@hooks`, `@i18n`, `@libs`, `@mappers`, `@messages`, `@models`, `@openapi`, `@providers`, `@stores`, `@typings`, `@utils`, `@email`.  
Do **not** use `@types` (reserved by TypeScript).

## Workflow

**Nhỏ:** chat → implement → review.  
**Lớn:** OpenSpec (superspec) → bạn review → Superpowers → verify/archive.  
Chi tiết: `docs/working-with-stitch.md` mục 0.

One change ≈ one PR. Prefer conventional commits.

## Do not

- Put internal CRUD mutations on Route Handlers
- Expose `MONGODB_URI` / `AUTH_SECRET` to the client
- Skip response envelope on new API/actions
- Force OpenSpec for typos / one-line CSS / tiny polish
- Start large features (multi-screen, auth/API/DB) without an OpenSpec change
