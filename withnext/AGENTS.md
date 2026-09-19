# Agents — empresa Plana intranet

## Commands

```bash
pnpm run dev          # next dev --turbopack
pnpm run build        # next build (production)
pnpm run typecheck    # tsc --noEmit
pnpm run check        # biome check . (lint + format)
pnpm run lint         # biome lint .
pnpm run format       # biome format --write .

pnpm run db:setup     # generate + push + seed (full reset)
pnpm run db:push      # push schema to Neon
pnpm run db:seed      # seed demo data
pnpm run db:demo      # CRUD validation script
```

**Required order for verification:** `check → typecheck → build`. CI runs `check` and `build` separately.

## Architecture

- **App Router** (`app/[locale]/`). Locale routing via `next-intl`.
- **API routes** under `app/intranet/` (NOT `app/api/`). Middleware matcher excludes `intranet` from i18n routing.
- **Server Components** by default. `'use client'` only for interactivity (forms, modals, dynamic UI).

## i18n

- 4 locales: `ca` (default, no prefix), `es`, `en`, `fr` (with prefix).
- `localePrefix: "as-needed"` — `ca` lives at `/`, others at `/es/...`.
- Translation files: `i18n/messages/{ca,es,en,fr}.json`.
- Server: `getTranslations` from `next-intl/server`. Client: `useTranslations` from `next-intl`.
- `params` is a `Promise` in Next.js 15+ — always `await params`.

## Database (Prisma 7 + Neon)

- **Schema:** `prisma/schema.prisma`. Generator `prisma-client` (NOT `prisma-client-js`), output `generated/prisma/`, `compilerBuild: "fast"`.
- **Datasource:** `provider = "postgresql"` — **no `url` in schema**. URL lives in `prisma.config.ts`.
- **Split URLs:** `DATABASE_URL` (pooled, runtime) vs `DATABASE_URL_UNPOOLED` (direct, CLI). **Do not swap.**
- **Client import:** `import { PrismaClient } from "../generated/prisma/client"` — NOT from `@prisma/client`.
- **`generated/`** is gitignored — regenerate via `pnpm run db:generate` or `postinstall`.
- **Seed:** `prisma/seed.ts` uses `PrismaPg` adapter directly, imports from `../generated/prisma/client`.
- **pnpm approve-builds:** if `pnpm install` fails with `ERR_PNPM_IGNORED_BUILDS`, run `pnpm approve-builds @parcel/watcher @prisma/engines @swc/core esbuild prisma`.

## Auth

- JWT via `jose` (HS256). Cookie `ep_session` (httpOnly, sameSite lax, 7d expiry).
- Passwords: `scrypt` (salt:hash hex). Empty hash = ghost user (never authenticates).
- Session payload: `{ id: number, username: string, role: "client"|"worker"|"admin" }`.
- ACL: WordPress-style capabilities in `shared/acl.ts`. Authorization asks by capability, never by role directly.

## Git encoding (tildes/acentos)

- `core.quotepath false` — git no escapa rutas con caracteres no-ASCII.
- `i18n.commitEncoding utf-8` / `i18n.logOutputEncoding utf-8` — mensajes de commit en UTF-8.
- Locale del sistema: `es_ES.UTF-8` (ya instalado; si `git log` muestra `<C3>` o `M-CM-`, revisar `LANG`/`LC_ALL`).

## Paths

- `@/*` maps to project root (NOT `src/`).
- `#shared/*` maps to `./shared/*` (used for `shared/acl.ts`).

## Styling

- Tailwind v4 with `@theme` tokens in `app/globals.css`.
- Design system: see `DESIGN.md`.
- Icons: Material Symbols Outlined (Google Fonts link in root layout).
- Font: Geist (loaded via `next/font/google`).

## Gotchas

- `prisma/seed-data/supabase-schema.ts` is excluded from tsconfig (legacy SQL file, not valid TS).
- `.env` is gitignored and NOT tracked. Never commit credentials.
- `middleware.ts` matcher: `/((?!intranet|_next|.*\\..*).*)` — `intranet` and `_next` are excluded from i18n routing.
- `release.yml` calls `scripts/bump-version.mjs` which does NOT exist yet — manual release workflow will fail until created.
- `check.yml` uses a dummy `DATABASE_URL` (localhost) — Prisma config requires the var to exist even for lint/build.
