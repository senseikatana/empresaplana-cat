import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { AuthError, requireCapability } from "@/lib/acl";

interface FleetRoute {
	id: number;
	code: string;
	name: string;
	origin: string;
	destination: string;
	status: string;
}

export default async function LineasPage() {
	try {
		await requireCapability("fleet:view");
	} catch (e) {
		if (e instanceof AuthError) redirect("/dashboard/login");
		throw e;
	}

	const t = await getTranslations("app");

	let routes: FleetRoute[] = [];
	try {
		const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/intranet/fleet/routes`, {
			cache: "no-store",
		});
		if (res.ok) {
			const data = await res.json();
			routes = data?.data ?? data ?? [];
		}
	} catch {}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-headline-md text-on-surface">{t("worker.linesTitle")}</h1>
				<p className="text-sm text-on-surface-variant mt-1">{t("worker.linesDesc")}</p>
			</div>

			{routes.length === 0 ? (
				<div className="text-center py-12">
					<span className="material-symbols-outlined text-5xl text-outline">directions_bus</span>
					<p className="text-on-surface-variant mt-4">{t("gestion.common.empty")}</p>
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{routes.map((route) => (
						<div key={route.id} className="p-5 bg-surface-container-lowest rounded-xl shadow-sm">
							<div className="flex items-center justify-between mb-3">
								<span className="text-xs font-bold px-2.5 py-1 rounded-full bg-deep-navy text-white">
									{route.code}
								</span>
								<span
									className={`text-xs px-2 py-0.5 rounded-full ${
										route.status === "active"
											? "bg-secondary-container text-on-secondary-container"
											: "bg-surface-container text-on-surface-variant"
									}`}
								>
									{route.status === "active"
										? t("gestion.states.active")
										: t("gestion.states.inactive")}
								</span>
							</div>
							<p className="font-medium text-on-surface">{route.name}</p>
							<p className="text-sm text-on-surface-variant mt-1">
								{route.origin} → {route.destination}
							</p>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
