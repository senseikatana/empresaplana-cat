# Empresaplana — Intranet Multi-stack

Intranet corporativa de **Empresaplana**, implementada con distintos frameworks para comparar rendimiento, DX y funcionalidades.

## Versiones

| Versión | Tech stack | Estado |
|---|---|---|
| [`astro/`](withastro/) | Astro + Islands | ✅ Activa |
| [`nuxt/`](withnuxt/) | Nuxt 3 + Vue | ✅ Activa |
| [`next/`](withnext/) | Next-React + Vite | ✅ Activa |

## Instalación

```bash
# Astro
cd withastro && npm install && npm run dev

# Nuxt or Vue SPA
cd withnuxt && yarn install && yarn dev

# React or Next
cd withnext && bun install && bun run dev
```

## Estructura

```
empresaplana/
├── withastro/      # Intranet con Astro (SSR + Islands)
├── withnuxt/       # Intranet con Nuxt 3
├── withnext/      # Intranet con Next or React
└── README.md
```
