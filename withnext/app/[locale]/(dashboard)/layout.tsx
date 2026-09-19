"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { hasCapability, type Role } from "#shared/acl";

interface SessionUser {
	id: number;
	username: string;
	role: Role;
}

const NAV_ITEMS = [
	{ href: "/dashboard", icon: "home", labelKey: "home", cap: null },
	{
		href: "/dashboard/mensajes",
		icon: "chat",
		labelKey: "messages",
		cap: "chat:access" as const,
	},
	{
		href: "/dashboard/cliente/favoritas",
		icon: "favorite",
		labelKey: "favorites",
		cap: null,
		roles: ["client"],
	},
	{
		href: "/dashboard/cliente/cotizaciones",
		icon: "request_quote",
		labelKey: "quotes",
		cap: null,
		roles: ["client"],
	},
	{
		href: "/dashboard/trabajador/lineas",
		icon: "directions_bus",
		labelKey: "lines",
		cap: "fleet:view" as const,
	},
	{
		href: "/dashboard/trabajador/incidencias",
		icon: "warning",
		labelKey: "incidents",
		cap: "fleet:view" as const,
	},
	{
		href: "/dashboard/trabajador/reportes",
		icon: "assessment",
		labelKey: "reports",
		cap: "fleet:view" as const,
	},
	{
		href: "/dashboard/gestion",
		icon: "admin_panel_settings",
		labelKey: "gestion",
		cap: "users:manage" as const,
	},
];

const GESTION_SECTIONS = [
	{ seccion: "mapa", icon: "map", labelKey: "gestion.map" },
	{ seccion: "rutas", icon: "route", labelKey: "gestion.routes" },
	{ seccion: "autobuses", icon: "directions_bus", labelKey: "gestion.buses" },
	{ seccion: "paradas", icon: "location_on", labelKey: "gestion.stops" },
	{ seccion: "horarios", icon: "schedule", labelKey: "gestion.schedules" },
	{ seccion: "conductores", icon: "person", labelKey: "gestion.drivers" },
	{
		seccion: "notificaciones",
		icon: "notifications",
		labelKey: "gestion.notifications",
	},
	{ seccion: "reportes", icon: "bar_chart", labelKey: "gestion.reports" },
	{
		seccion: "integraciones",
		icon: "extension",
		labelKey: "gestion.integrations",
	},
];

const MOBILE_NAV = [
	{ href: "/dashboard", icon: "home", labelKey: "home" },
	{ href: "/dashboard/mensajes", icon: "chat", labelKey: "messages" },
	{
		href: "/dashboard/cliente/favoritas",
		icon: "favorite",
		labelKey: "favorites",
		roles: ["client"],
	},
	{
		href: "/dashboard/trabajador/lineas",
		icon: "directions_bus",
		labelKey: "lines",
		roles: ["worker"],
	},
	{
		href: "/dashboard/gestion",
		icon: "admin_panel_settings",
		labelKey: "gestion",
		roles: ["admin"],
	},
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	const t = useTranslations("app");
	const router = useRouter();
	const [user, setUser] = useState<SessionUser | null>(null);
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [gestionOpen, setGestionOpen] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch("/intranet/me")
			.then((r) => (r.ok ? r.json() : null))
			.then((data) => {
				if (data?.data?.user) setUser(data.data.user);
				else router.push("/dashboard/login");
			})
			.catch(() => router.push("/dashboard/login"))
			.finally(() => setLoading(false));
	}, [router]);

	const handleLogout = async () => {
		await fetch("/intranet/auth/logout", { method: "POST" });
		router.push("/dashboard/login");
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-background">
				<span className="material-symbols-outlined text-4xl text-deep-navy animate-spin">
					progress_activity
				</span>
			</div>
		);
	}

	if (!user) return null;

	const visibleNav = NAV_ITEMS.filter((item) => {
		if (item.cap && !hasCapability(user.role, item.cap)) return false;
		if (item.roles && !item.roles.includes(user.role)) return false;
		return true;
	});

	const visibleMobile = MOBILE_NAV.filter((item) => {
		if (item.roles && !item.roles.includes(user.role)) return false;
		return true;
	});

	const showGestion = hasCapability(user.role, "users:manage");

	return (
		<div className="flex flex-col min-h-screen bg-background">
			<header className="sticky top-0 z-40 flex items-center justify-between h-14 px-4 bg-deep-navy text-white shadow-md">
				<div className="flex items-center gap-3">
					<button
						className="lg:hidden material-symbols-outlined"
						onClick={() => setSidebarOpen(!sidebarOpen)}
					>
						menu
					</button>
					<Link href="/dashboard" className="flex items-center gap-2">
						<span className="font-bold text-lg tracking-tight">Empresa Plana</span>
					</Link>
				</div>
				<div className="flex items-center gap-2">
					<span className="text-sm hidden sm:inline">{user.username}</span>
					<span className="text-xs px-2 py-0.5 rounded-full bg-white/20 capitalize">
						{t(`role.${user.role}`)}
					</span>
					<button className="material-symbols-outlined text-xl" title="Dark mode">
						dark_mode
					</button>
					<button
						onClick={handleLogout}
						className="material-symbols-outlined text-xl"
						title={t("nav.logout")}
					>
						logout
					</button>
				</div>
			</header>

			<div className="flex flex-1 overflow-hidden">
				<aside
					className={`
            fixed lg:static inset-y-0 left-0 z-30 w-60 bg-deep-navy text-white pt-14 lg:pt-0
            transform transition-transform duration-200 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
            flex flex-col overflow-y-auto
          `}
				>
					<nav className="flex-1 py-4 px-3 space-y-1">
						{visibleNav.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								onClick={() => setSidebarOpen(false)}
								className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors"
							>
								<span className="material-symbols-outlined text-xl">{item.icon}</span>
								{t(`nav.${item.labelKey}`)}
							</Link>
						))}

						{showGestion && (
							<div>
								<button
									onClick={() => setGestionOpen(!gestionOpen)}
									className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors"
								>
									<span className="flex items-center gap-3">
										<span className="material-symbols-outlined text-xl">admin_panel_settings</span>
										{t("nav.gestion")}
									</span>
									<span className="material-symbols-outlined text-lg">
										{gestionOpen ? "expand_less" : "expand_more"}
									</span>
								</button>
								{gestionOpen && (
									<div className="ml-4 mt-1 space-y-0.5">
										{GESTION_SECTIONS.map((sec) => (
											<Link
												key={sec.seccion}
												href={`/dashboard/gestion/${sec.seccion}`}
												onClick={() => setSidebarOpen(false)}
												className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-white/10 transition-colors"
											>
												<span className="material-symbols-outlined text-lg">{sec.icon}</span>
												{t(sec.labelKey)}
											</Link>
										))}
									</div>
								)}
							</div>
						)}
					</nav>

					<div className="p-3 border-t border-white/10">
						<Link
							href="/"
							onClick={() => setSidebarOpen(false)}
							className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors"
						>
							<span className="material-symbols-outlined text-xl">language</span>
							{t("panel.backToSite")}
						</Link>
					</div>
				</aside>

				{sidebarOpen && (
					<div
						className="fixed inset-0 z-20 bg-black/50 lg:hidden"
						onClick={() => setSidebarOpen(false)}
					/>
				)}

				<main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">{children}</main>
			</div>

			<nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-outline-variant flex justify-around items-center h-16 px-2">
				{visibleMobile.map((item) => (
					<Link
						key={item.href}
						href={item.href}
						className="flex flex-col items-center gap-0.5 text-xs text-on-surface-variant hover:text-deep-navy transition-colors"
					>
						<span className="material-symbols-outlined text-xl">{item.icon}</span>
						{t(`nav.${item.labelKey}`)}
					</Link>
				))}
			</nav>
		</div>
	);
}
