import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { AuthError, requireCapability } from "@/lib/acl";

const VALID_SECTIONS = [
	"mapa",
	"rutas",
	"autobuses",
	"paradas",
	"horarios",
	"conductores",
	"notificaciones",
	"reportes",
	"integraciones",
] as const;

type Section = (typeof VALID_SECTIONS)[number];

const ENTITY_MAP: Record<string, { endpoint: string; fields: string[]; icon: string }> = {
	rutas: {
		endpoint: "/intranet/fleet/routes",
		fields: ["code", "name", "origin", "destination"],
		icon: "route",
	},
	autobuses: {
		endpoint: "/intranet/fleet/buses",
		fields: ["number", "plate", "company", "capacity"],
		icon: "directions_bus",
	},
	paradas: {
		endpoint: "/intranet/fleet/stops",
		fields: ["name", "address", "lat", "lng"],
		icon: "location_on",
	},
	horarios: {
		endpoint: "/intranet/fleet/schedules",
		fields: ["route", "departure", "arrival", "frequency"],
		icon: "schedule",
	},
	conductores: {
		endpoint: "/intranet/fleet/drivers",
		fields: ["name", "phone", "license", "bus"],
		icon: "person",
	},
	notificaciones: {
		endpoint: "/intranet/fleet/notifications",
		fields: ["type", "title", "description", "routeName"],
		icon: "notifications",
	},
};

function SectionContent({ seccion, t }: { seccion: Section; t: any }) {
	if (seccion === "mapa") {
		return (
			<div className="flex flex-col items-center justify-center py-16 text-center">
				<span className="material-symbols-outlined text-6xl text-deep-navy mb-4">map</span>
				<p className="text-lg font-medium text-on-surface">{t("gestion.map.title")}</p>
				<p className="text-sm text-on-surface-variant mt-2">{t("gestion.map.subtitle")}</p>
			</div>
		);
	}

	if (seccion === "reportes") {
		return (
			<div className="space-y-6">
				<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
					{["kpiPassengers", "kpiPunctuality", "kpiKm", "kpiFuel"].map((kpi) => (
						<div
							key={kpi}
							className="p-5 bg-surface-container-lowest rounded-xl shadow-sm text-center"
						>
							<p className="text-2xl font-bold text-on-surface">--</p>
							<p className="text-xs text-on-surface-variant mt-1">{t(`gestion.reports.${kpi}`)}</p>
						</div>
					))}
				</div>
				<div className="text-center py-8">
					<span className="material-symbols-outlined text-5xl text-outline">bar_chart</span>
					<p className="text-on-surface-variant mt-4">{t("gestion.reports.title")}</p>
				</div>
			</div>
		);
	}

	if (seccion === "integraciones") {
		const integrations = [
			{ key: "motis", icon: "alt_route", connected: true },
			{ key: "traccar", icon: "gps_fixed", connected: true },
			{ key: "gtfs", icon: "folder_zip", connected: false },
			{ key: "data", icon: "database", connected: false },
		];
		return (
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{integrations.map((int) => (
					<div key={int.key} className="p-5 bg-surface-container-lowest rounded-xl shadow-sm">
						<div className="flex items-center justify-between mb-3">
							<div className="flex items-center gap-3">
								<span className="material-symbols-outlined text-2xl text-deep-navy">
									{int.icon}
								</span>
								<p className="font-medium text-on-surface">
									{t(`gestion.integrations.${int.key}.title`)}
								</p>
							</div>
							{int.connected && (
								<span className="text-xs px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container">
									{t("gestion.integrations.connected")}
								</span>
							)}
						</div>
						<p className="text-sm text-on-surface-variant">
							{t(`gestion.integrations.${int.key}.desc`)}
						</p>
					</div>
				))}
			</div>
		);
	}

	const entity = ENTITY_MAP[seccion];
	if (!entity) return null;

	const entityLabel = seccion === "notificaciones" ? "notifications" : seccion.slice(0, -1);

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<span className="material-symbols-outlined text-2xl text-deep-navy">{entity.icon}</span>
					<span className="text-sm text-on-surface-variant">{t("gestion.common.empty")}</span>
				</div>
			</div>
			<div className="bg-surface-container-lowest rounded-xl overflow-hidden">
				<table className="w-full">
					<thead>
						<tr className="border-b border-outline-variant">
							{entity.fields.map((field) => (
								<th
									key={field}
									className="text-left text-xs font-semibold text-on-surface-variant px-4 py-3 uppercase tracking-wide"
								>
									{t(`gestion.entities.${entityLabel}.fields.${field}`)}
								</th>
							))}
							<th className="text-left text-xs font-semibold text-on-surface-variant px-4 py-3 uppercase tracking-wide">
								{t("gestion.common.actions")}
							</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td
								colSpan={entity.fields.length + 1}
								className="text-center py-12 text-on-surface-variant text-sm"
							>
								{t("gestion.common.empty")}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default async function SeccionPage({
	params,
}: {
	params: Promise<{ locale: string; seccion: string }>;
}) {
	const { seccion } = await params;

	if (!VALID_SECTIONS.includes(seccion as Section)) {
		notFound();
	}

	try {
		await requireCapability("users:manage");
	} catch (e) {
		if (e instanceof AuthError) redirect("/dashboard/login");
		throw e;
	}

	const t = await getTranslations("app");

	const sectionLabels: Record<Section, string> = {
		mapa: t("gestion.nav.map"),
		rutas: t("gestion.nav.routes"),
		autobuses: t("gestion.nav.buses"),
		paradas: t("gestion.nav.stops"),
		horarios: t("gestion.nav.schedules"),
		conductores: t("gestion.nav.drivers"),
		notificaciones: t("gestion.nav.notifications"),
		reportes: t("gestion.nav.reports"),
		integraciones: t("gestion.nav.integrations"),
	};

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-headline-md text-on-surface">{sectionLabels[seccion as Section]}</h1>
			</div>
			<SectionContent seccion={seccion as Section} t={t} />
		</div>
	);
}
