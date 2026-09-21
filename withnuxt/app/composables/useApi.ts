import { useInitApis } from "katanakit-js";

useInitApis({
	internal: {
		baseUri: "",
		endpoints: {
			health: "/api/health",
			me: "/api/me",
			login: "/api/auth/login",
			logout: "/api/auth/logout",
			register: "/api/auth/register",
			account: "/api/account",
			offices: "/api/offices",
			budget: "/api/budget",
			budgets: "/api/budgets",
			favorites: "/api/favorites",
			routeSearch: "/api/routes/search",
			fleetSummary: "/api/fleet/summary",
			fleetRoutes: "/api/fleet/routes",
			fleetNotifications: "/api/fleet/notifications",
			chat: "/api/chat",
			chatMessages: "/api/chat/:id",
		},
	},
});
