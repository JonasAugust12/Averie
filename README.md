# Averie

[![Lint](https://github.com/JonasAugust12/Averie/actions/workflows/lint.yml/badge.svg)](https://github.com/JonasAugust12/Averie/actions/workflows/lint.yml)
[![Commit Lint](https://github.com/JonasAugust12/Averie/actions/workflows/commit-lint.yml/badge.svg)](https://github.com/JonasAugust12/Averie/actions/workflows/commit-lint.yml)
[![Deploy](https://github.com/JonasAugust12/Averie/actions/workflows/deploy.yml/badge.svg)](https://github.com/JonasAugust12/Averie/actions/workflows/deploy.yml)

Averie is a quiet-luxury nail salon and beauty care platform built on Next.js App Router. It is designed as a unified fullstack monolith where both the rich client experience (customer booking, staff schedule calendar, and administrative control center) and the serverless backend API / Server Actions coexist within a single cohesive project. It deploys either to Vercel or, self-hosted, to a single Bizfly Cloud server driven entirely from GitHub Actions.

This repository contains the interactive customer booking engine, real-time staff scheduling calendar powered by FullCalendar, appointment management dashboard, service catalog administration, salon operating hours engine, Resend-powered transactional email (confirmation, reminders, admin send), Cloudinary-backed promotional banner manager, multi-language localization (`next-intl`), and automated OpenAPI documentation with Scalar.

## Stack Snapshot

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)
![Auth.js](https://img.shields.io/badge/Auth.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-4B2E1F?style=for-the-badge&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-0B1220?style=for-the-badge&logo=cloudinary&logoColor=3448C5)
![Resend](https://img.shields.io/badge/Resend-000000?style=for-the-badge&logo=resend&logoColor=white)
![Scalar](https://img.shields.io/badge/Scalar-0F172A?style=for-the-badge&logo=swagger&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Bizfly Cloud](https://img.shields.io/badge/Bizfly_Cloud-0066CC?style=for-the-badge&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-0F172A?style=for-the-badge&logo=githubactions&logoColor=2088FF)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Terraform](https://img.shields.io/badge/Terraform-844FBA?style=for-the-badge&logo=terraform&logoColor=white)
![Ansible](https://img.shields.io/badge/Ansible-1A1918?style=for-the-badge&logo=ansible&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)

## What Averie Is

Averie transforms traditional salon operations into a modern, aesthetic, and automated booking experience for beauty and nail care studios.

- **Customer-Centric Booking**: Interactive appointment scheduling with instant categorization, service selection, technician preferences, and dynamic operating hours validation.
- **Appointment Tracking**: Booking reference code generation (`AVR-XXXXX`) and instant lookup ticket view for clients to check their reservation status.
- **Technician & Schedule Coordination**: Dedicated visual staff schedule calendar powered by FullCalendar with color-coded technician profiles and availability tracking.
- **Administrative Operations**: Full-fledged admin dashboard for managing bookings, staff members, service catalogs, operating weekday schedules, and holiday day-offs.
- **Promotional Showcase**: Dynamic promotional banners and salon marketing assets managed via Cloudinary integration.
- **Transactional Email**: Branded booking confirmation and reminder emails via Resend and React Email; optional guest email on booking; Vercel Cron for ~1-hour-before reminders; admin manual resend from booking detail.
- **Serverless Architecture**: Single Next.js repository serving both rich React client interfaces and backend endpoints/mutations directly on MongoDB Atlas with connection caching.

## Highlight Features

- **Interactive Multi-Step Booking**:
    - Filterable service categories (Manicure, Pedicure, Gel Polish, Nail Enhancements, Facials, Add-ons) with real-time pricing and estimated duration totals.
    - Staff preference selector allowing clients to choose any available specialist or a specific technician.
    - Smart time slot picker generated from weekday operational hours, period slots (morning/afternoon/evening), and holiday exceptions.
    - Form validation with Zod and React Hook Form, generating unique reference codes.
    - Optional email field with helper text; confirmation email sent automatically when provided.
- **Transactional Email (Resend)**:
    - Branded React Email templates (confirmation + reminder) with Averie theme and salon contact details for noreply sends.
    - Confirmation on successful booking create when `customer.email` is set; booking still succeeds if send fails.
    - Vercel Cron (`/api/cron/booking-reminders`, every 2 hours) for reminders ~1 hour before appointment (salon timezone window).
    - Admin **Send email** on booking detail — confirmation or reminder to any recipient address.
- **Boarding-Pass Style Booking Lookup**:
    - Reference code and phone number search card displaying comprehensive booking information (technician, date/time, total duration, price, and live status).
    - Copy-to-clipboard for reference codes and responsive bento-grid card layout.
- **FullCalendar Staff Schedule Visualizer**:
    - Interactive calendar views (Month, Week, Day) with assigned technician color coding, appointment duration blocks, and client metadata tooltips.
- **Comprehensive Admin Control Center**:
    - Booking management with quick status transitions (upcoming, completed, cancelled) and date/technician filtering.
    - Staff directory with CRUD operations, specialty tagging, custom color picker (`react-colorful`), initials, and visibility toggles.
    - Service catalog management with category sorting, Lucide icons, pricing, and estimated durations.
    - Operational schedule controls with weekday toggles, custom period slot definitions, and special holiday day-offs.
    - Promotional management with Cloudinary image upload and live banner status toggling.
- **Staff Portal**:
    - Clean, focused portal for technicians to check daily assigned appointments without admin privileges.
- **Role-Based Authentication (RBAC)**:
    - Built with Auth.js (NextAuth v5 beta), bcrypt password hashing, and role-based route protection (`admin`, `staff`) enforced by Next.js Edge Middleware.
- **DevTools Protection, Response Obfuscation & Encrypted Storage**:
    - Dual-layer DevTools detection (`DevToolsGuard.tsx`) combining `disable-devtool` library probes, window gap polling, shortcut blocking, and automatic redirect in production (`NEXT_PUBLIC_ENABLE_DEVTOOLS_GUARD=true`).
    - AES-256-GCM response obfuscation for GET Route Handlers (`ENABLE_OBFUSCATION=1`), encrypting server payloads on Node.js and decrypting transparently on the browser via Axios response interceptors (`NEXT_PUBLIC_ENABLE_OBFUSCATION=true`).
    - AES-256-GCM client storage encryption for Zustand persisted stores (`useBookingStore`, `usePreferencesStore`), protecting draft customer data in `localStorage` (`NEXT_PUBLIC_ENABLE_STORAGE_ENCRYPTION=true`).
- **Multi-Language Support**:
    - Seamless English (`en`) and Vietnamese (`vi`) internationalization powered by `next-intl` and server-action cookie synchronization.
- **Automated API Documentation**:
    - Auto-generated OpenAPI spec via `next-openapi-gen` paired with a modern Scalar API reference UI at `/api/docs`.

## Architecture & Fullstack Conventions

Averie follows a clean separation of concerns within a Next.js App Router fullstack architecture:

### 1. Query vs. Mutation Separation

| Operation                                   | Pattern                | Location                         | Client Access                                          |
| :------------------------------------------ | :--------------------- | :------------------------------- | :----------------------------------------------------- |
| **Queries / Reads** (GET)                   | Next.js Route Handlers | `src/app/api/**/route.ts`        | TanStack Query + Axios (`apiClient`) via `@services/*` |
| **Mutations** (POST / PUT / PATCH / DELETE) | Next.js Server Actions | `src/actions/*.action.ts`        | TanStack Query `useMutation` via `@services/*`         |
| **External & Webhooks / Docs**              | Next.js Route Handlers | `src/app/api/*`                  | External callers / Scalar UI                           |
| **Auth Session HTTP**                       | Route Handler          | `src/app/api/auth/[...nextauth]` | Auth.js client library                                 |
| **Auth Mutation (Login/Logout)**            | Server Actions         | `src/actions/auth.action.ts`     | `useLogin`, `useLogout` hooks                          |

- **Why GET via Route Handlers**: Predictable REST endpoints, edge/server caching capability, clean external integration, and easy OpenAPI documentation generation.
- **Why Mutations via Server Actions**: Zero boilerplate for POST endpoints, type-safe RPC execution directly from UI forms, automatic input validation with Zod, and direct execution against MongoDB.

### 2. Unified Response Envelope

All Route Handlers and Server Actions return a standardized response shape:

```json
{
    "status": 200,
    "message": "OK",
    "data": {}
}
```

- **Route Handlers**: `apiSuccess(data, message, status)` and `apiError(message, status, code)` in `src/app/api/_lib/http.ts`.
- **Server Actions**: `apiSuccessResult(data, message, status)` and `apiErrorResult(message, status)` in `src/libs/action.util.ts`.
- **Client Unwrapper**: `unwrapApiResponse()` in `src/libs/action.util.ts` automatically unwraps `data` and throws on HTTP error codes (`status >= 400`).

### 3. Serverless MongoDB Connection Pooling

- In serverless environments (such as Vercel), Mongoose connections are cached on `globalThis` to prevent connection exhaustion across warm/cold invocations (`src/libs/mongodb.ts`).
- Built-in DNS SRV resolution helper (`src/libs/mongo-dns.ts`) ensures reliable cluster connectivity across local and cloud environments.

### 4. Role-Based Middleware Protection

- Edge middleware (`src/middleware.ts`) inspects the Auth.js JWT session token and guards administrative routes (`/admin/*`) and staff routes (`/staff/*`), redirecting unauthorized requests to appropriate login gates.

## Tech Stack

### Frontend

- **Framework**: Next.js 15 (App Router)
- **UI Core**: React 19, TypeScript
- **Styling**: Tailwind CSS v4, Lucide React
- **Motion & UI Components**: Framer Motion, FullCalendar (`@fullcalendar/react`, `@fullcalendar/daygrid`, `@fullcalendar/timegrid`, `@fullcalendar/interaction`), react-colorful, react-toastify
- **Typography**: Playfair Display (Headlines & Accents) + Inter (Body & Controls)

### State, Data & Validation

- **Server State**: TanStack Query v5 (`@tanstack/react-query`) with React Query Devtools
- **Client State**: Zustand v5
- **HTTP Client**: Axios
- **Form Management**: React Hook Form
- **Validation**: Zod v4 (schemas shared between client forms and server actions)

### Backend & Persistence

- **API Engine**: Next.js Route Handlers & Server Actions
- **Database**: MongoDB Atlas
- **ODM**: Mongoose v8
- **Authentication**: Auth.js (`next-auth` v5 beta) with credentials provider & bcryptjs password hashing

### Media, Email & Integrations

- **Media Storage**: Cloudinary SDK (promotional asset management)
- **Transactional Email**: Resend SDK + React Email (`@react-email/components`) — templates under `src/emails/`, send helpers in `src/server/email.server.ts`
- **Scheduled Jobs (Vercel)**: `vercel.json` cron → `GET /api/cron/booking-reminders` (requires `CRON_SECRET`)
- **API Documentation**: Scalar (`@scalar/nextjs-api-reference`) & OpenAPI (`next-openapi-gen`)
- **Internationalization**: `next-intl` (English & Vietnamese)

### Tooling & CI/CD

- **Package Manager**: pnpm 10
- **Code Quality**: ESLint 9 (Flat Config), Prettier
- **Git Hooks**: Husky, lint-staged, Commitlint (Conventional Commits)
- **CI/CD**: GitHub Actions — lint, build, deploy, and the full server lifecycle
- **Container**: Multi-stage Dockerfile producing a Next.js standalone runtime
- **Infrastructure**: Terraform (Bizfly provider) for the server, Ansible for host configuration
- **Edge**: Nginx reverse proxy with optional Let's Encrypt TLS

## Product Routes at a Glance

The application routes are organized under [`src/app`](./src/app):

- `(user)` — Customer-facing portal
    - `/` — Luxury salon landing page with services preview, philosophy, ambient glow effects, and testimonials
    - `/book` — Interactive multi-step appointment booking flow
    - `/book/lookup` — Boarding-pass style ticket search and reference code tracking
    - `/login` — Client authentication portal
- `admin` — Operational administration portal
    - `/admin` — Dashboard overview with booking metrics and recent activity
    - `/admin/bookings` — Appointment management and status controls
    - `/admin/schedule` — Visual staff schedule calendar powered by FullCalendar
    - `/admin/staff` — Staff team directory, specialties, and calendar color configuration
    - `/admin/services` — Service catalog and category administration
    - `/admin/settings` — Weekday working hours, time slots, and day-off exceptions
    - `/admin/settings/promotions` — Promotional banners and Cloudinary media upload
    - `/admin/login` — Admin authentication gate
- `staff` — Technician schedule portal
    - `/staff` — Focused appointment and roster view for salon technicians
- `api` — REST Route Handlers
    - `/api/health` — Service and database health check
    - `/api/bookings` — Booking queries and customer reference lookups
    - `/api/services` & `/api/service-categories` — Service catalog queries
    - `/api/staff` — Staff directory queries
    - `/api/settings` — Operating hours and salon settings queries
    - `/api/admin` — Administrative metrics queries
    - `/api/cron/booking-reminders` — Vercel Cron reminder batch (Bearer `CRON_SECRET`; not public)
    - `/api/auth/[...nextauth]` — Auth.js protocol handling
    - `/api/docs` & `/api/openapi.json` — Scalar interactive documentation and OpenAPI spec

## Path Aliases

| Alias            | Target Folder       | Description                                           |
| :--------------- | :------------------ | :---------------------------------------------------- |
| `@actions/*`     | `src/actions/*`     | Server Actions (mutations & writes)                   |
| `@components/*`  | `src/components/*`  | Reusable & domain UI components                       |
| `@guard/*`       | `src/guard/*`       | Client/route guard helpers & security detection       |
| `@hooks/*`       | `src/hooks/*`       | Custom React hooks                                    |
| `@i18n/*`        | `src/i18n/*`        | next-intl routing and helpers                         |
| `@email/*`       | `src/emails/*`      | React Email templates and email-specific components   |
| `@libs/*`        | `src/libs/*`        | MongoDB, Auth.js, Cloudinary, Axios, Query Client     |
| `@mappers/*`     | `src/mappers/*`     | Domain DTO mappers and transformers                   |
| `@messages/*`    | `messages/*`        | Translation JSON dictionaries                         |
| `@models/*`      | `src/models/*`      | Mongoose database models                              |
| `@openapi/*`     | `src/openapi/*`     | OpenAPI schema definitions & spec builder             |
| `@providers/*`   | `src/providers/*`   | Context providers (Auth, Query, Locale)               |
| `@server/*`      | `src/server/*`      | Server-only business logic & data enrichment services |
| `@services/*`    | `src/services/*`    | Client TanStack Query hooks & service layer           |
| `@stores/*`      | `src/stores/*`      | Zustand state stores                                  |
| `@typings/*`     | `src/types/*`       | TypeScript domain types & interfaces                  |
| `@utils/*`       | `src/utils/*`       | Utility functions                                     |
| `@validations/*` | `src/validations/*` | Zod validation schemas (shared FE & BE)               |
| `@/*`            | `src/*`             | Source root fallback                                  |

## Project Structure

```text
.
├── .github/
│   ├── actions/              # Composite actions shared by the workflows
│   │   ├── ansible-setup/    # Ansible, deploy key, inventory, SSH readiness
│   │   └── terraform-setup/  # Terraform, remote-state backend, credentials
│   └── workflows/            # Lint, commit-lint, deploy, DNS, infra lifecycle
├── ansible/                  # Docker install, Nginx + app stack, TLS issuance
│   ├── group_vars/           # Non-secret defaults; CI overrides what it needs
│   └── templates/            # docker-compose, nginx.conf, runtime env file
├── terraform/                # Bizfly server, firewall, SSH key
├── docs/                     # Architectural documentation, conventions, and guides
├── messages/                 # i18n translation dictionaries (en, vi)
├── openapi/                  # Generated OpenAPI schema definition
├── public/                   # Static assets, branding logos, icons
├── scripts/                  # Database scripts and the Name.com DNS updater
├── src/
│   ├── actions/              # Next.js Server Actions (mutations & writes)
│   ├── app/                  # App Router layouts, pages, and API Route Handlers
│   │   ├── (user)/           # Public landing and booking flow
│   │   ├── admin/            # Admin management dashboard
│   │   ├── api/              # REST Route Handlers (queries & docs)
│   │   └── staff/            # Staff portal
│   ├── components/           # Modular UI components by domain
│   │   ├── admin/            # Admin layout, forms, tables, modals
│   │   ├── booking/          # Booking steps, time picker, lookup cards
│   │   ├── common/           # Buttons, inputs, modals, shells, badges
│   │   ├── landing/          # Hero, services, philosophy, testimonials
│   │   └── staff/            # Staff calendar and appointment views
│   ├── emails/               # React Email templates (confirmation, reminder)
│   ├── guard/                # Client & auth guards (e.g. devtools detector)
│   ├── hooks/                # Custom React hooks
│   ├── i18n/                 # next-intl configuration and routing
│   ├── libs/                 # Auth.js, MongoDB connection, Cloudinary, API client
│   ├── mappers/              # Domain DTO mappers and transformers
│   ├── models/               # Mongoose schemas (User, Booking, Service, Settings)
│   ├── openapi/              # OpenAPI specs, schemas, and example builders
│   ├── providers/            # Auth, React Query, and Locale providers
│   ├── server/               # Server-only services (booking enrichment, schedule, promotions)
│   ├── services/             # Client TanStack Query hooks (actions & API)
│   ├── stores/               # Zustand global UI state stores
│   ├── types/                # TypeScript type definitions and interfaces
│   ├── utils/                # Date formatting, price calculation, helper functions
│   ├── validations/          # Zod validation schemas shared across FE & BE
│   ├── instrumentation.ts    # Next.js server runtime instrumentation hook
│   ├── middleware.ts         # Edge RBAC route protection
│   └── next.config.ts        # Next.js configuration
├── Dockerfile                # Multi-stage build to a Next.js standalone runtime
├── vercel.json               # Vercel Cron schedule for booking reminder emails
├── next-openapi-gen.config.json # OpenAPI generation config
└── package.json              # Dependencies and scripts
```

## Local Development

### Prerequisites

- **Node.js**: `24.x` (or `>= 20.x`)
- **Package Manager**: `pnpm` (version 10 recommended)
- **Database**: MongoDB Atlas instance (or local MongoDB connection string)

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment

Create a local environment file from the example template:

```bash
cp .env.example .env.local
```

Configure your `MONGODB_URI` and generate an `AUTH_SECRET`:

```bash
# Generate secret for Auth.js:
openssl rand -base64 32
```

### 3. Database Check & Seed

Verify your MongoDB Atlas connection and populate initial salon data (Admin user, Staff members with calendar color profiles, Service categories, Services, Operating schedules, and Sample Bookings):

```bash
# Test connection
pnpm db:check

# Seed initial salon catalog & default accounts
pnpm db:seed
```

**Default Seeded Credentials:**

- **Admin**: `admin@averie.local` / `Admin123!`
- **Staff Members**: `mia@averie.local`, `elena@averie.local`, `jordan@averie.local`, `sofia@averie.local` / `Staff123!`

### 4. Run the Development Server

```bash
pnpm dev
```

The application will be available at:

- **Customer Portal**: `http://localhost:3000`
- **Booking Flow**: `http://localhost:3000/book`
- **Admin Dashboard**: `http://localhost:3000/admin`
- **Staff Portal**: `http://localhost:3000/staff`
- **API Documentation (Scalar)**: `http://localhost:3000/api/docs` (when `ENABLE_API_DOCS=1`)

### Useful Commands

```bash
pnpm dev              # Start dev server with OpenAPI generator
pnpm build            # Build production bundle
pnpm start            # Start production server
pnpm lint             # Run ESLint check
pnpm format:check     # Verify Prettier code formatting
pnpm format           # Automatically format all files
pnpm type-check       # Validate TypeScript types without emitting
pnpm openapi:gen      # Regenerate OpenAPI schema definitions
pnpm db:check         # Test MongoDB Atlas connection
pnpm db:diagnose      # Diagnose MongoDB DNS SRV resolution
pnpm db:seed          # Seed salon admin, staff, services, and schedules
```

## Environment Variables

Reference configuration is documented in [`.env.example`](./.env.example).

### Core Runtime & App

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ROUTE_LOADING_MIN_MS=1200
```

### Auth.js (NextAuth v5)

```env
AUTH_SECRET=your-32-character-random-secret
AUTH_URL=http://localhost:3000
AUTH_SESSION_MAX_AGE_SECONDS=2592000
```

### MongoDB Atlas (Serverless Database)

```env
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/averie?retryWrites=true&w=majority
MONGODB_DNS_SERVERS=8.8.8.8,1.1.1.1 # Optional DNS fallback for Windows SRV queries
MONGODB_DEBUG=0
```

### API Documentation

```env
ENABLE_API_DOCS=1 # Set to 1 to enable /api/docs (Scalar) and /api/openapi.json
```

### Media Storage (Cloudinary)

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Transactional Email (Resend)

Used on **Vercel** for confirmation emails, appointment reminders, and admin manual send. See [docs/email-resend-setup.md](docs/email-resend-setup.md).

```env
RESEND_API_KEY=re_xxxxxxxx
EMAIL_FROM=Averie <noreply@averienails.com>
CRON_SECRET=your-random-secret          # openssl rand -base64 32
SALON_TIMEZONE=America/New_York         # Reminder window uses salon-local time
```

On Vercel, enable **Cron Jobs** (Pro plan) — `vercel.json` invokes `/api/cron/booking-reminders` every 2 hours. Without `RESEND_API_KEY`, sends are skipped gracefully (booking create still succeeds).

For **local** or **Bizfly Docker**, set `BOOKING_REMINDER_CRON_MODE=internal` to run an in-process scheduler on `pnpm start` / container boot, or keep the default and use system cron + curl. See [docs/email-resend-setup.md](docs/email-resend-setup.md).

### Security & Production Protection

```env
PRODUCTION_BROWSER_SOURCE_MAPS=false
NEXT_PUBLIC_ENABLE_DEVTOOLS_GUARD=false
NEXT_PUBLIC_DEVTOOLS_REDIRECT_URL=https://www.youtube.com/watch?v=dQw4w9WgXcQ

# Response Obfuscation (AES-256-GCM)
ENABLE_OBFUSCATION=1
OBFUSCATION_SECRET=your-44-character-random-secret
NEXT_PUBLIC_ENABLE_OBFUSCATION=true

# Zustand Storage Encryption (AES-256-GCM)
NEXT_PUBLIC_ENABLE_STORAGE_ENCRYPTION=true
```

## CI/CD

GitHub Actions workflows are configured in [`.github/workflows`](./.github/workflows).

### Quality gates

- `lint.yml`
    - Runs on `push` and `pull_request`
    - Sets up Node.js 24 and pnpm
    - Executes ESLint (`pnpm run lint`)
    - Executes TypeScript Type Checking (`pnpm run type-check`)
    - Executes Prettier Code Formatting Check (`pnpm run format:check`)

- `commit-lint.yml`
    - Enforces Conventional Commits on all commits and Pull Requests
    - Validates PR title and commit messages (`feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `revert`)

### Delivery

- `deploy.yml`
    - Runs on every push to `main`, or on demand with an existing `image_tag` to redeploy without rebuilding
    - Builds the image and pushes it to Bizfly Container Registry as `main-<short-sha>`
    - Runs the Ansible playbooks over SSH, then waits on the container healthcheck
    - Rolls back to the previously running image if the new one never turns healthy

### Server lifecycle

Each of these is a button under `Actions`. They share a concurrency group, so two
can never apply at once.

| Workflow            | What it does                                                                      |
| ------------------- | --------------------------------------------------------------------------------- |
| `infra-create`      | Applies the Terraform, writes `SERVER_HOST`, updates DNS, can chain into `deploy` |
| `infra-start`       | Powers a stopped server on and repairs `SERVER_HOST` / DNS if the IP moved        |
| `infra-stop`        | Powers off, keeping the disk, the IP and the firewall                             |
| `infra-destroy`     | Deletes the server; keeps the container registry unless told otherwise            |
| `infra-tls`         | Issues the Let's Encrypt certificate and switches Nginx to HTTPS                  |
| `update-bizfly-dns` | Re-points the subdomain by hand when needed                                       |

## Deployment

Averie runs on either of two targets from the same codebase.

**Vercel** — the default serverless path. Nothing extra is required beyond the
environment variables in [`.env.example`](./.env.example). Set `RESEND_API_KEY`,
`EMAIL_FROM`, and `CRON_SECRET` for transactional email and reminder cron (see
[docs/email-resend-setup.md](docs/email-resend-setup.md)). Its apex and `www`
DNS records are managed by `update-dns.yml`, which is kept separate from
`update-bizfly-dns.yml` so the two targets can never edit each other's records.

**Bizfly Cloud** — self-hosted: one server running the app container behind
Nginx, image built in CI and pulled from Bizfly Container Registry, with
Terraform describing the infrastructure and Ansible configuring the host.
Everything is driven from the Actions tab; the only local command in the whole
process is generating the deploy SSH key.

Two design decisions are worth knowing before changing anything there:

- **Secrets are never baked into the image.** Only `NEXT_PUBLIC_*` values and
  `CLOUDINARY_CLOUD_NAME` are build arguments — they end up in the browser bundle
  regardless. `MONGODB_URI`, `AUTH_SECRET` and the Cloudinary API keys are
  rendered into `/opt/averie/app.env` (mode 0600, root-owned) at deploy time, so
  pulling the image reveals none of them.
- **Terraform state lives in Bizfly Simple Storage**, not on anyone's laptop. An
  Actions runner is wiped after every run, so remote state is what lets the
  lifecycle buttons see the same infrastructure.

Full setup walkthrough, including every secret and variable the pipeline reads:
[docs/deployment-bizfly.md](docs/deployment-bizfly.md).

### Bizfly logs & debugging

Start with the failing **GitHub Actions** run (`Actions → deploy`). The deploy
job already prints Ansible output; if the container healthcheck fails, the playbook
dumps the **last 80 lines** of `averie-web` into the workflow log before any
rollback attempt.

When you need the server directly, SSH as **`root`** (Bizfly default — see
[docs/deployment-bizfly.md](docs/deployment-bizfly.md)):

```bash
ssh -i ~/.ssh/averie root@<SERVER_HOST>
```

| What you need               | Where to look                                              |
| --------------------------- | ---------------------------------------------------------- |
| Stack status                | `sudo docker compose -f /opt/averie/docker-compose.yml ps` |
| App (Next.js)               | `sudo docker logs -f averie-web`                           |
| Nginx reverse proxy         | `sudo docker logs -f averie-nginx`                         |
| Runtime secrets (0600)      | `/opt/averie/app.env` — rendered on each deploy            |
| Nginx config                | `/opt/averie/nginx/nginx.conf`                             |
| TLS renewal                 | `/var/log/averie-certbot.log`                              |
| First-boot SSH / cloud-init | `sudo tail -100 /var/log/cloud-init-output.log`            |

Common quick checks:

```bash
# Health from inside the server (MongoDB must be reachable)
curl -s -H "Host: bizfly.averienails.com" http://127.0.0.1/api/health | jq

# Follow both containers
sudo docker compose -f /opt/averie/docker-compose.yml logs -f averie-web averie-nginx
```

Typical failures:

- **`Permission denied (publickey)`** on deploy → wrong `SERVER_USER` (must be
  `root` on Bizfly) or stale SSH key; see deployment-bizfly.md troubleshooting.
- **Healthcheck / `bad auth`** → Atlas credentials or missing `/averie` in
  `MONGODB_URI`; run `pnpm db:check` locally with the same URI as the GitHub
  secret.
- **502 from Nginx** → `averie-web` crashed or not on `averie_network`; check
  `docker logs averie-web`.

## Related Documentation

For deeper details on architectural guidelines, design system tokens, and agent workflows, see:

- [Project Overview & Architecture](docs/overview.md)
- [Backend Conventions & Rules](docs/backend-conventions.md)
- [Advanced Workflow & Design System](docs/advanced-workflow.md)
- [Working with Stitch MCP](docs/working-with-stitch.md)
- [Deploying on Bizfly Cloud](docs/deployment-bizfly.md)
- [Resend email setup (Vercel)](docs/email-resend-setup.md)
- [What the Ansible playbooks put on the server](ansible/README.md)

## Summary

Averie delivers a complete, production-ready beauty salon management and booking ecosystem. By coupling Next.js 15 App Router with a structured division between Route Handlers (queries) and Server Actions (mutations), MongoDB serverless connection pooling, FullCalendar technician scheduling, and a quiet-luxury design system, Averie achieves a high-performance monolith with low operational overhead.

The same codebase ships either to Vercel or to a single self-hosted Bizfly server, where creating, pausing, deploying to and tearing down the infrastructure are all buttons in the Actions tab rather than commands anyone has to remember.
