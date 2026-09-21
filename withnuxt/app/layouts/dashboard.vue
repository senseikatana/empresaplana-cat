<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import { hasCapability, isRole } from "#shared/acl";

const { t, locale } = useI18n();
const localePath = useLocalePath();
const switchLocalePath = useSwitchLocalePath();
const route = useRoute();

const { isNotificationsSlideoverOpen, toggleNotifications, toggleCommandPalette } = useDashboard();

const { data } = await useFetch<{
	user: { id: number; username: string; name?: string; role: string };
}>("/api/me", { headers: useRequestHeaders(["cookie"]) });

useHead({ meta: [{ name: "robots", content: "noindex, nofollow" }] });

const role = computed(() => {
	const r = data.value?.user?.role;
	return r && isRole(r) ? r : undefined;
});

const userName = computed(() => data.value?.user?.name ?? data.value?.user?.username ?? "");

// --- Navigation items per role ---
const clientNav: NavigationMenuItem[] = [
	{ label: t("app.panel.home"), icon: "i-lucide-home", to: localePath("/dashboard/cliente") },
	{ label: t("app.panel.account"), icon: "i-lucide-user", to: localePath("/dashboard/cliente/cuenta") },
	{ label: t("app.panel.favorites"), icon: "i-lucide-star", to: localePath("/dashboard/cliente/favoritas") },
	{ label: t("app.panel.quotes"), icon: "i-lucide-file-text", to: localePath("/dashboard/cliente/cotizaciones") },
	{ label: t("app.panel.messages"), icon: "i-lucide-message-circle", to: localePath("/dashboard/mensajes") },
];

const workerNav: NavigationMenuItem[] = [
	{ label: t("app.panel.home"), icon: "i-lucide-bus", to: localePath("/dashboard/trabajador") },
	{ label: t("app.panel.lines"), icon: "i-lucide-route", to: localePath("/dashboard/trabajador/lineas") },
	{ label: t("app.panel.incidents"), icon: "i-lucide-alert-triangle", to: localePath("/dashboard/trabajador/incidencias") },
	{ label: t("app.panel.reports"), icon: "i-lucide-clipboard-check", to: localePath("/dashboard/trabajador/reportes") },
	{ label: t("app.panel.messages"), icon: "i-lucide-message-circle", to: localePath("/dashboard/mensajes") },
];

const adminNav: NavigationMenuItem[] = [
	{ label: t("app.gestion.nav.panel"), icon: "i-lucide-layout-dashboard", to: localePath("/dashboard/gestion") },
	{ label: t("app.gestion.nav.map"), icon: "i-lucide-map", to: localePath("/dashboard/gestion/mapa") },
	{ label: t("app.gestion.nav.routes"), icon: "i-lucide-route", to: localePath("/dashboard/gestion/rutas") },
	{ label: t("app.gestion.nav.buses"), icon: "i-lucide-bus", to: localePath("/dashboard/gestion/autobuses") },
	{ label: t("app.gestion.nav.stops"), icon: "i-lucide-map-pin", to: localePath("/dashboard/gestion/paradas") },
	{ label: t("app.gestion.nav.schedules"), icon: "i-lucide-clock", to: localePath("/dashboard/gestion/horarios") },
	{ label: t("app.gestion.nav.drivers"), icon: "i-lucide-id-card", to: localePath("/dashboard/gestion/conductores") },
	{ label: t("app.gestion.nav.notifications"), icon: "i-lucide-bell", to: localePath("/dashboard/gestion/notificaciones") },
	{ label: t("app.gestion.nav.reports"), icon: "i-lucide-bar-chart-3", to: localePath("/dashboard/gestion/reportes") },
	{ label: t("app.gestion.nav.integrations"), icon: "i-lucide-plug", to: localePath("/dashboard/gestion/integraciones") },
	{ label: t("app.panel.messages"), icon: "i-lucide-message-circle", to: localePath("/dashboard/mensajes") },
];

const navItems = computed<NavigationMenuItem[]>(() => {
	if (!role.value) return [];
	if (hasCapability(role.value, "users:manage")) return adminNav;
	if (hasCapability(role.value, "fleet:view")) return workerNav;
	return clientNav;
});

const footerNav: NavigationMenuItem[] = [
	{ label: t("app.panel.backToSite"), icon: "i-lucide-external-link", to: localePath("/") },
];

async function logout() {
	await $fetch("/api/auth/logout", { method: "POST" });
	await navigateTo(localePath("/dashboard/login"));
}

// --- Keyboard shortcuts ---
const shortcuts: { label: string; kbd: string[]; action: () => void }[] = [
	{ label: t("app.panel.messages"), kbd: ["M"], action: () => navigateTo(localePath("/dashboard/mensajes")) },
	{ label: "Notifications", kbd: ["N"], action: toggleNotifications },
	{ label: "Command Palette", kbd: ["Meta", "K"], action: toggleCommandPalette },
];

onMounted(() => {
	function handleKeydown(e: KeyboardEvent) {
		if ((e.metaKey || e.ctrlKey) && e.key === "k") {
			e.preventDefault();
			toggleCommandPalette();
		}
	}
	window.addEventListener("keydown", handleKeydown);
	return () => window.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
	<UDashboardGroup>
		<UDashboardSidebar
			collapsible
			resizable
			:ui="{ footer: 'border-t border-default' }"
		>
			<template #header="{ collapsed }">
				<NuxtLink :to="localePath('/')" class="flex items-center gap-2.5" :class="collapsed ? 'justify-center' : ''">
					<span class="i-lucide-bus text-xl text-primary shrink-0" />
					<span v-if="!collapsed" class="font-bold text-highlighted truncate">
						{{ t("common.brand") }}
					</span>
				</NuxtLink>
			</template>

			<template #default="{ collapsed }">
				<UNavigationMenu :items="navItems" :collapsed="collapsed" />
			</template>

			<template #footer="{ collapsed }">
				<div class="flex flex-col gap-2">
					<UNavigationMenu :items="footerNav" :collapsed="collapsed" />
					<div v-if="!collapsed" class="flex items-center gap-2 px-2 py-1.5">
						<UAvatar :alt="userName" size="sm" color="primary" />
						<div class="flex-1 min-w-0">
							<p class="text-sm font-medium text-highlighted truncate">{{ userName }}</p>
							<p class="text-xs text-muted">{{ t(`app.role.${role ?? 'client'}`) }}</p>
						</div>
						<UButton icon="i-lucide-log-out" color="neutral" variant="ghost" size="xs" @click="logout" />
					</div>
				</div>
			</template>
		</UDashboardSidebar>

		<slot />
	</UDashboardGroup>
</template>
