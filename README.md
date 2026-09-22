# Empresaplana — Intranet Multi-stack

Intranet corporativa de **Empresaplana**, implementada con dos frameworks para comparar rendimiento, DX y funcionalidades. Ambos proyectos comparten el mismo backend (Prisma + PostgreSQL), el mismo diseño (design system "Empresa Plana - Branding") y las mismas funcionalidades de dashboard.

## Versiones

| Versión | Tech stack | Estado |
|---|---|---|
| [`withastro/`](withastro/) | Astro 7 + React islands + Prisma/PG | ✅ Activa |
| [`withnuxt/`](withnuxt/) | Nuxt 4 + Nuxt UI v4 + Prisma/PG | ✅ Activa |

## Instalación

```bash
# Astro (bun)
cd withastro && bun install && bun run dev

# Nuxt (pnpm)
cd withnuxt && pnpm install && pnpm run dev
```

## Stack compartido

- **DB**: Prisma 7 + PostgreSQL (`@prisma/adapter-pg` + `pg`)
- **Auth**: jose HS256 JWT en cookie `ep_session` (httpOnly, 7d) + scrypt
- **ACL**: WordPress-style (roles → capabilities) — 3 roles: `client`, `worker`, `admin`
- **i18n**: 4 locales (ca/es/en/fr)
- **Design**: tokens en `@theme` de Tailwind v4, Geist + Material Symbols
- **Demo users**: `admin`, `trabajador`, `cliente` (passkey `12345678`)

## Dashboard (14 páginas en ambos proyectos)

```
dashboard/index          → redirect por rol
dashboard/login          → form + cuentas demo
dashboard/register       → form registro
dashboard/mensajes       → chat (WebSocket)
dashboard/cliente/*      → index, cuenta, favoritas, cotizaciones
dashboard/trabajador/*   → index, lineas, incidencias, reportes
dashboard/gestion/*      → index (KPIs), [seccion] dinámico
```

## Estructura

```
empresaplana-cat/
├── withastro/      # Intranet con Astro (SSR + islands)
├── withnuxt/       # Intranet con Nuxt 4
└── README.md
```

---

# 📋 Tareas pendientes — 22/09/2026

## 1. Revisar lo creado
- [X] Revisar el código generado en `withastro/` (dashboard, API routes, middleware, layout)
- [ ] Revisar el fix de `toggleNotifications` en `withnuxt/app/layouts/dashboard.vue`
- [ ] Abrir ambos proyectos en VSCode y confirmar que todo se ve bien

## 2. Navegar y probar
- [X] Levantar `bun run dev` en Astro y navegar todas las páginas del dashboard
- [X] Levantar `pnpm run dev` en Nuxt y navegar todas las páginas del dashboard
- [X] Probar auth flow completo con las 3 cuentas demo (admin/trabajador/cliente)
- [ ] Verificar que las páginas protegidas redirigen a login sin sesión
- [ ] Comprobar i18n en los 4 locales (ca/es/en/fr)

## 3. Variables de entorno y producción
- [ ] Copiar `.env.example` → `.env` en ambos proyectos
- [ ] Configurar `DATABASE_URL` + `DATABASE_URL_UNPOOLED` + `AUTH_SECRET`
- [ ] Correr `bun run db:setup` en Astro (Prisma generate + push + seed)
- [ ] Correr `pnpm run db:generate` en Nuxt
- [ ] Preparar entorno de producción (Render para Nuxt, Node adapter para Astro)

## 4. Sincronización
- [ ] Confirmar que ambos proyectos tienen las mismas 14 páginas de dashboard
- [ ] Confirmar que las API routes coinciden (account, favorites, budgets, fleet, chat)
- [ ] Confirmar que los i18n JSON son idénticos (4 locales)
- [ ] Confirmar que el ACL coincide (shared/acl.ts ↔ src/lib/acl.ts)

## 5. Deployment
- [ ] Comprobar que el deployment no falla
- [ ] Build de producción: `npx astro build` + `npx nuxi build`
- [ ] Health check: `GET /api/health` en ambos

## 6. Database en InsForge
- [ ] Comprobar la base de datos en InsForge (proyecto `empresaplana.cat`)
- [ ] Verificar conexión con `DATABASE_URL` de InsForge

## 7. InsForge self-hosted (Docker)
- [ ] Ver tutorial para poner InsForge en local con Docker
- [ ] Objetivo: generar proyectos infinitos self-hosted
- [ ] Probar InsForge local como backend de desarrollo
- [ ] Tutorial 1: https://www.youtube.com/watch?v=b1APqHYFHtI
- [ ] Tutorial 2: https://www.youtube.com/watch?v=-IX2RmKoVCo
- [ ] ⚠️ Auto-alojar InsForge NO es fácil — analizar los videos con calma y replicar paso a paso

## 8. Presentación para el cliente
- [ ] Preparar la presentación para el cliente
- [ ] Elegir qué stack mostrar (¿Astro o Nuxt?)
- [ ] Preparar demo del dashboard (roles, chat, gestión)
