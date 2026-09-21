import type { NavigationMenuItem } from "@nuxt/ui";

const isNotificationsSlideoverOpen = ref(false);
const isCommandPaletteOpen = ref(false);

export function useDashboard() {
	return {
		isNotificationsSlideoverOpen: readonly(isNotificationsSlideoverOpen),
		toggleNotifications() {
			isNotificationsSlideoverOpen.value = !isNotificationsSlideoverOpen.value;
		},
		closeNotifications() {
			isNotificationsSlideoverOpen.value = false;
		},
		isCommandPaletteOpen: readonly(isCommandPaletteOpen),
		toggleCommandPalette() {
			isCommandPaletteOpen.value = !isCommandPaletteOpen.value;
		},
		closeCommandPalette() {
			isCommandPaletteOpen.value = false;
		},
	};
}
