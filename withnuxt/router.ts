import type { Capability } from "#shared/acl";

export type RouteAuth =
	| { kind: "public" }
	| { kind: "session" }
	| { kind: "capability"; capability: Capability };

export interface RouteDef {
	path: string;
	source: string;
	auth: RouteAuth;
	layout?: "default" | "dashboard";
	localized?: boolean;
}

export const router: RouteDef[] = [
	{
		path: "/",
		source: "app/pages/index.vue",
		auth: { kind: "public" },
		layout: "default",
		localized: true,
	},
	{
		path: "/rutas-horarios",
		source: "app/pages/rutas-horarios.vue",
		auth: { kind: "public" },
		layout: "default",
		localized: true,
	},
	{
		path: "/servicios-discrecionales",
		source: "app/pages/servicios-discrecionales.vue",
		auth: { kind: "public" },
		layout: "default",
		localized: true,
	},
	{
		path: "/servicios/[slug]",
		source: "app/pages/servicios/[slug].vue",
		auth: { kind: "public" },
		layout: "default",
		localized: true,
	},
	{
		path: "/solicitar-presupuesto",
		source: "app/pages/solicitar-presupuesto.vue",
		auth: { kind: "public" },
		layout: "default",
		localized: true,
	},
	{
		path: "/donde-estamos",
		source: "app/pages/donde-estamos.vue",
		auth: { kind: "public" },
		layout: "default",
		localized: true,
	},
	{
		path: "/politica-privacidad",
		source: "app/pages/politica-privacidad.vue",
		auth: { kind: "public" },
		layout: "default",
		localized: true,
	},
	{
		path: "/politica-cookies",
		source: "app/pages/politica-cookies.vue",
		auth: { kind: "public" },
		layout: "default",
		localized: true,
	},
	{
		path: "/aviso-legal",
		source: "app/pages/aviso-legal.vue",
		auth: { kind: "public" },
		layout: "default",
		localized: true,
	},

	{
		path: "/dashboard/login",
		source: "app/pages/dashboard/login.vue",
		auth: { kind: "public" },
	},
	{
		path: "/dashboard/register",
		source: "app/pages/dashboard/register.vue",
		auth: { kind: "public" },
	},
	{
		path: "/dashboard",
		source: "app/pages/dashboard/index.vue",
		auth: { kind: "session" },
		layout: "dashboard",
	},
	{
		path: "/dashboard/mensajes",
		source: "app/pages/dashboard/mensajes.vue",
		auth: { kind: "capability", capability: "chat:access" },
		layout: "dashboard",
	},

	{
		path: "/dashboard/cliente",
		source: "app/pages/dashboard/cliente/index.vue",
		auth: { kind: "capability", capability: "dashboard:access" },
		layout: "dashboard",
	},
	{
		path: "/dashboard/cliente/cuenta",
		source: "app/pages/dashboard/cliente/cuenta.vue",
		auth: { kind: "capability", capability: "profile:edit" },
		layout: "dashboard",
	},
	{
		path: "/dashboard/cliente/favoritas",
		source: "app/pages/dashboard/cliente/favoritas.vue",
		auth: { kind: "capability", capability: "dashboard:access" },
		layout: "dashboard",
	},
	{
		path: "/dashboard/cliente/cotizaciones",
		source: "app/pages/dashboard/cliente/cotizaciones.vue",
		auth: { kind: "capability", capability: "dashboard:access" },
		layout: "dashboard",
	},

	{
		path: "/dashboard/trabajador",
		source: "app/pages/dashboard/trabajador/index.vue",
		auth: { kind: "capability", capability: "fleet:view" },
		layout: "dashboard",
	},
	{
		path: "/dashboard/trabajador/lineas",
		source: "app/pages/dashboard/trabajador/lineas.vue",
		auth: { kind: "capability", capability: "fleet:view" },
		layout: "dashboard",
	},
	{
		path: "/dashboard/trabajador/incidencias",
		source: "app/pages/dashboard/trabajador/incidencias.vue",
		auth: { kind: "capability", capability: "fleet:view" },
		layout: "dashboard",
	},
	{
		path: "/dashboard/trabajador/reportes",
		source: "app/pages/dashboard/trabajador/reportes.vue",
		auth: { kind: "capability", capability: "fleet:view" },
		layout: "dashboard",
	},

	{
		path: "/dashboard/gestion",
		source: "app/pages/dashboard/gestion/index.vue",
		auth: { kind: "capability", capability: "users:manage" },
		layout: "dashboard",
	},
	{
		path: "/dashboard/gestion/[seccion]",
		source: "app/pages/dashboard/gestion/[seccion].vue",
		auth: { kind: "capability", capability: "users:manage" },
		layout: "dashboard",
	},
];

export const api: { method: string; path: string; source: string }[] = [
	{ method: "GET", path: "/api/health", source: "server/api/health.get.ts" },
	{ method: "GET", path: "/api/me", source: "server/api/me.get.ts" },
	{
		method: "POST",
		path: "/api/auth/login",
		source: "server/api/auth/login.post.ts",
	},
	{
		method: "POST",
		path: "/api/auth/register",
		source: "server/api/auth/register.post.ts",
	},
	{
		method: "POST",
		path: "/api/auth/logout",
		source: "server/api/auth/logout.post.ts",
	},
	{ method: "GET", path: "/api/account", source: "server/api/account.get.ts" },
	{
		method: "PATCH",
		path: "/api/account",
		source: "server/api/account.patch.ts",
	},
	{
		method: "GET",
		path: "/api/favorites",
		source: "server/api/favorites.get.ts",
	},
	{
		method: "PUT",
		path: "/api/favorites",
		source: "server/api/favorites.put.ts",
	},
	{ method: "GET", path: "/api/budgets", source: "server/api/budgets.get.ts" },
	{ method: "POST", path: "/api/budget", source: "server/api/budget.post.ts" },
	{ method: "GET", path: "/api/offices", source: "server/api/offices.get.ts" },
	{
		method: "GET",
		path: "/api/routes/search",
		source: "server/api/routes/search.get.ts",
	},
	{
		method: "GET",
		path: "/api/fleet/summary",
		source: "server/api/fleet/summary.get.ts",
	},
	{
		method: "GET",
		path: "/api/fleet/routes",
		source: "server/api/fleet/routes.get.ts",
	},
	{
		method: "GET",
		path: "/api/fleet/notifications",
		source: "server/api/fleet/notifications.get.ts",
	},
	{ method: "GET", path: "/api/chat", source: "server/api/chat/index.get.ts" },
	{
		method: "POST",
		path: "/api/chat",
		source: "server/api/chat/index.post.ts",
	},
	{
		method: "GET",
		path: "/api/chat/[id]",
		source: "server/api/chat/[id].get.ts",
	},
	{
		method: "GET",
		path: "/sitemap.xml",
		source: "server/routes/sitemap.xml.ts",
	},
	{ method: "WS", path: "/chat.ws", source: "server/routes/chat.ws.ts" },
];
