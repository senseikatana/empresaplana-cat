import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { AuthError, requireCapability } from "@/lib/acl";

interface FleetSummary {
	routes: number;
	buses: number;
	stops: number;
	drivers: number;
	alerts: number;
}

export default async function GestionPage() {
	try {
		await requireCapability("users:manage");
	} catch (e) {
		if (e instanceof AuthError) redirect("/dashboard/login");
		throw e;
	}

	const t = await getTranslations("app");

	let summary: FleetSummary = {
		routes: 0,
		buses: 0,
		stops: 0,
		drivers: 0,
		alerts: 0,
	};
	try {
		const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/intranet/fleet/summary`, {
			cache: "no-store",
		});
		if (res.ok) {
			const data = await res.json();
			summary = data?.data ?? data ?? summary;
		}
	} catch {}

	const kpis = [
		{
			label: t("gestion.dashboard.kpiRoutes"),
			value: summary.routes,
			icon: "route",
			color: "bg-deep-navy",
		},
		{
			label: t("gestion.dashboard.kpiBuses"),
			value: summary.buses,
			icon: "directions_bus",
			color: "bg-coastal-teal",
		},
		{
			label: t("gestion.dashboard.kpiStops"),
			value: summary.stops,
			icon: "location_on",
			color: "bg-energetic-orange",
		},
		{
			label: t("gestion.dashboard.kpiDrivers"),
			value: summary.drivers,
			icon: "person",
			color: "bg-navy-600",
		},
		{
			label: t("gestion.dashboard.kpiAlerts"),
			value: summary.alerts,
			icon: "notifications",
			color: "bg-error",
		},
	];

	const quickLinks = [
		{
			href: "/dashboard/gestion/mapa",
			icon: "map",
			label: t("gestion.nav.map"),
		},
		{
			href: "/dashboard/gestion/rutas",
			icon: "route",
			label: t("gestion.nav.routes"),
		},
		{
			href: "/dashboard/gestion/autobuses",
			icon: "directions_bus",
			label: t("gestion.nav.buses"),
		},
		{
			href: "/dashboard/gestion/paradas",
			icon: "location_on",
			label: t("gestion.nav.stops"),
		},
		{
			href: "/dashboard/gestion/horarios",
			icon: "schedule",
			label: t("gestion.nav.schedules"),
		},
		{
			href: "/dashboard/gestion/conductores",
			icon: "person",
			label: t("gestion.nav.drivers"),
		},
		{
			href: "/dashboard/gestion/notificaciones",
			icon: "notifications",
			label: t("gestion.nav.notifications"),
		},
		{
			href: "/dashboard/gestion/reportes",
			icon: "bar_chart",
			label: t("gestion.nav.reports"),
		},
		{
			href: "/dashboard/gestion/integraciones",
			icon: "extension",
			label: t("gestion.nav.integrations"),
		},
	];

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-headline-md text-on-surface">{t("gestion.dashboard.title")}</h1>
				<p className="text-sm text-on-surface-variant mt-1">{t("gestion.dashboard.subtitle")}</p>
			</div>

			<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
				{kpis.map((kpi) => (
					<div
						key={kpi.label}
						className="p-5 bg-surface-container-lowest rounded-xl shadow-sm text-center"
					>
						<div
							className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${kpi.color} text-white mb-3`}
						>
							<span className="material-symbols-outlined text-xl">{kpi.icon}</span>
						</div>
						<p className="text-2xl font-bold text-on-surface">{kpi.value}</p>
						<p className="text-xs text-on-surface-variant mt-1">{kpi.label}</p>
					</div>
				))}
			</div>

			<div>
				<h2 className="text-lg font-semibold text-on-surface mb-4">
					{t("gestion.dashboard.quickTitle")}
				</h2>
				<div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
					{quickLinks.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className="flex flex-col items-center gap-2 p-4 bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-shadow"
						>
							<span className="material-symbols-outlined text-2xl text-deep-navy">{link.icon}</span>
							<span className="text-xs font-medium text-on-surface text-center">{link.label}</span>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}
