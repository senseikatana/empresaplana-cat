# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2026-09-16

### BREAKING CHANGE

- Full framework migration from Nuxt 4/Vue to Next.js 15 App Router/React 19
- Database migrated from InsForge Postgres to Neon Postgres
- Auth system reimplemented: jose HS256 + scrypt + cookie `ep_session` (compatible with v1)
- i18n migrated from `@nuxtjs/i18n` to `next-intl` (4 locales: ca, es, en, fr)

### Added

- Next.js 15 App Router with locale-based routing (`app/[locale]/`)
- Tailwind v4 with Mediterranean Horizon design tokens
- Prisma 7 ORM with PrismaPg adapter
- Neon Postgres integration (pooled + unpooled connections)
- `scripts/database/` demo CRUD validation
- GitHub Actions workflow for CI (`check.yml`) and releases (`release.yml`)

### Removed

- Nuxt 4, Vue 3, `@nuxt/ui`, `@nuxtjs/i18n`
- InsForge integration (Compute, CLI, Postgres)
- `fly.toml`, Wrangler config (`wrangler.jsonc`)
- Nitro server layer

## [1.1.0] - Previous Nuxt version

- See git history for details
