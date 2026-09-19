# empresaplana-intranet

Empresa Plana intranet — Next.js 15 App Router + Prisma 7 + Neon Postgres.

Internal web app for Empresa Plana (public transport) providing route schedules, fleet management, budget requests, chat, and an admin dashboard.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 App Router (React 19) |
| Styling | Tailwind CSS v4 |
| Database | Prisma 7 ORM + Neon Postgres |
| Auth | jose HS256 JWT + scrypt passwords |
| i18n | next-intl — 4 locales (ca, es, en, fr) |
| Validation | Zod |
| Charts | katanakit-js |
| Content | MDX |
| Tooling | Biome (lint + format), pnpm, TypeScript |

## Quick Start

**Prerequisites:** Node.js 22.12+, pnpm 12+

```bash
git clone git@github.com:senseikatana/empresaplana-intranet-react.git
cd empresaplana-intranet-react
pnpm install
cp .env.example .env          # Edit with Neon strings + AUTH_SECRET
pnpm run db:setup             # generate + push + seed
pnpm run dev                  # http://localhost:3000
```

| Env Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Neon Postgres **pooled** (app runtime) |
| `DATABASE_URL_UNPOOLED` | Neon Postgres **unpooled** (Prisma CLI) |
| `AUTH_SECRET` | JWT signing secret (jose HS256) |

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm run dev` | Dev server (Turbopack) |
| `pnpm run build` | Production build |
| `pnpm run typecheck` | TypeScript check |
| `pnpm run check` | Biome lint + format |
| `pnpm run db:setup` | Full setup: generate + push + seed |
| `pnpm run db:studio` | Prisma Studio |
| `pnpm run db:demo` | Demo CRUD validation |

## Project Structure

```
empresaplana-intranet/
├── app/
│   ├── [locale]/               # (site)/ and (dashboard)/ route groups
│   ├── intranet/               # API routes (16 endpoints)
│   │   ├── auth/               # login, register, logout
│   │   ├── me/                 # Current user profile
│   │   ├── account/            # Account management
│   │   ├── favorites/          # User favorites
│   │   ├── budget/ & budgets/  # Budget CRUD
│   │   ├── chat/ & chat/[id]   # Chat system
│   │   ├── fleet/              # routes, summary, notifications
│   │   ├── routes/search/      # Route search
│   │   ├── offices/            # Office locations
│   │   └── health/             # Health check
│   ├── layout.tsx
│   └── globals.css
├── components/site/            # Shared site components
├── lib/                        # auth.ts, acl.ts, prisma.ts, logger.ts, rate-limit.ts
├── shared/acl.ts               # ACL definitions
├── i18n/                       # messages/, routing.ts, request.ts, navigation.ts
├── middleware.ts                # Locale + auth
├── prisma/                     # schema, seed, migrations
├── scripts/database/           # db.ts, demo-crud.ts
├── generated/                  # Prisma Client (gitignored)
├── .github/workflows/          # check.yml, release.yml
├── render.yaml                 # Render deployment blueprint
└── DESIGN.md                   # Design system reference
```

## Architecture

**Routing:** App Router + `next-intl` locale routing. Server Components by default; `'use client'` only for interactivity.

**Auth:** JWT via `jose` (HS256), cookie `ep_session` (httpOnly, 7d). Passwords: `scrypt` (salt:hash). Session payload: `{ id, username, role }`.

**ACL:** WordPress-style capabilities — see [`shared/acl.ts`](./shared/acl.ts).

| Role | Capabilities |
|------|-------------|
| `client` | `dashboard:access`, `profile:edit`, `chat:access`, `chat:create` |
| `worker` | + `chat:staff`, `fleet:view`, `budgets:view` |
| `admin` | All 12 capabilities |

**Database:** Prisma 7 + `@prisma/adapter-pg` → Neon Postgres. Pooled URL for runtime, unpooled for CLI.

**i18n:** 4 locales: `ca` (default, `/`), `es`, `en`, `fr` (with prefix). Dicts in `i18n/messages/`.

## Design System

**Mediterranean Horizon** — `deep-navy` (#013990), `coastal-teal` (#13AEB8), `energetic-orange` (#EB8E02). Font: Geist. Icons: Material Symbols Outlined.

→ [`DESIGN.md`](./DESIGN.md)

## API

All endpoints under `/intranet/` (not `/api/`). Health: `GET /intranet/health → { ok: true, db: "up" }`

→ [`docs/API.md`](./docs/API.md)

## Deployment

Blueprint: [`render.yaml`](./render.yaml). Also Vercel-ready. `pnpm run build && pnpm run start`

## Version

**2.0.0** — see [CHANGELOG.md](./CHANGELOG.md)

## License

Proprietary — Empresa Plana, S.L.
