# syntax=docker/dockerfile:1

# =============================================================================
# Averie — production image (Next.js standalone)
# Built by GitHub Actions and pushed to Bizfly Container Registry.
#
# Build-time args  : only NEXT_PUBLIC_* + values read by next.config.ts.
# Runtime env      : server secrets (MONGODB_URI, AUTH_SECRET, ...) are injected
#                    by docker-compose on the server, NOT baked into the image.
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Dependencies
# -----------------------------------------------------------------------------
FROM node:24-alpine AS deps
WORKDIR /app

ENV HUSKY=0
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

# -----------------------------------------------------------------------------
# Stage 2: Builder
# -----------------------------------------------------------------------------
FROM node:24-alpine AS builder
WORKDIR /app

ENV HUSKY=0
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Public runtime config — inlined into the client bundle at build time
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_ROUTE_LOADING_MIN_MS
ARG NEXT_PUBLIC_ENABLE_OBFUSCATION
ARG NEXT_PUBLIC_ENABLE_STORAGE_ENCRYPTION
ARG NEXT_PUBLIC_ENABLE_DEVTOOLS_GUARD
ARG NEXT_PUBLIC_DEVTOOLS_REDIRECT_URL

# Read by next.config.ts (images.remotePatterns / source maps)
ARG CLOUDINARY_CLOUD_NAME
ARG PRODUCTION_BROWSER_SOURCE_MAPS

ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
ENV NEXT_PUBLIC_ROUTE_LOADING_MIN_MS=${NEXT_PUBLIC_ROUTE_LOADING_MIN_MS}
ENV NEXT_PUBLIC_ENABLE_OBFUSCATION=${NEXT_PUBLIC_ENABLE_OBFUSCATION}
ENV NEXT_PUBLIC_ENABLE_STORAGE_ENCRYPTION=${NEXT_PUBLIC_ENABLE_STORAGE_ENCRYPTION}
ENV NEXT_PUBLIC_ENABLE_DEVTOOLS_GUARD=${NEXT_PUBLIC_ENABLE_DEVTOOLS_GUARD}
ENV NEXT_PUBLIC_DEVTOOLS_REDIRECT_URL=${NEXT_PUBLIC_DEVTOOLS_REDIRECT_URL}
ENV CLOUDINARY_CLOUD_NAME=${CLOUDINARY_CLOUD_NAME}
ENV PRODUCTION_BROWSER_SOURCE_MAPS=${PRODUCTION_BROWSER_SOURCE_MAPS}

RUN pnpm run build

# Drop source maps to keep the image small
RUN find .next -name "*.map" -type f -delete

# -----------------------------------------------------------------------------
# Stage 3: Runner
# -----------------------------------------------------------------------------
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Read at runtime by src/openapi/spec.ts via process.cwd() when ENABLE_API_DOCS=1
COPY --from=builder --chown=nextjs:nodejs /app/openapi ./openapi

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

HEALTHCHECK --interval=30s --timeout=10s --start-period=90s --retries=5 \
    CMD wget -q --spider http://127.0.0.1:3000/api/health || exit 1

CMD ["node", "server.js"]
