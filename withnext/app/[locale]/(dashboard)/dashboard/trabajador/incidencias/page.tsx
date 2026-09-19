import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { AuthError, requireCapability } from "@/lib/acl";

interface Notification {
	id: number;
	type: string;
	title: string;
	description: string;
	routeName: string;
	read: boolean;
	createdAt: string;
}

const TYPE_ICONS: Record<string, string> = {
	delay: "schedule",
	accident: "crash_alert",
	detour: "alt_route",
	info: "info",
};

export default async function IncidenciasPage() {
	try {
		await requireCapability("fleet:view");
	} catch (e) {
		if (e instanceof AuthError) redirect("/dashboard/login");
		throw e;
	}

	const t = await getTranslations("app");

	let notifications: Notification[] = [];
	try {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_BASE_URL || ""}/intranet/fleet/notifications`,
			{
				cache: "no-store",
			},
		);
		if (res.ok) {
			const data = await res.json();
			notifications = data?.data ?? data ?? [];
		}
	} catch {}

	return (
		<div className="max-w-3xl mx-auto space-y-6">
			<div>
				<h1 className="text-headline-md text-on-surface">{t("worker.incidents")}</h1>
				<p className="text-sm text-on-surface-variant mt-1">{t("worker.incidentsDesc")}</p>
			</div>

			{notifications.length === 0 ? (
				<div className="text-center py-12">
					<span className="material-symbols-outlined text-5xl text-outline">notifications</span>
					<p className="text-on-surface-variant mt-4">{t("worker.noIncidents")}</p>
				</div>
			) : (
				<div className="space-y-3">
					{notifications.map((notif) => (
						<div
							key={notif.id}
							className={`flex items-start gap-4 p-4 rounded-xl shadow-sm ${
								notif.read
									? "bg-surface-container-lowest"
									: "bg-surface-container-low border-l-4 border-energetic-orange"
							}`}
						>
							<span className="material-symbols-outlined text-2xl text-deep-navy mt-0.5">
								{TYPE_ICONS[notif.type] || "notifications"}
							</span>
							<div className="flex-1 min-w-0">
								<div className="flex items-center justify-between gap-2">
									<p className="font-medium text-on-surface truncate">{notif.title}</p>
									<span className="text-xs text-on-surface-variant shrink-0">
										{new Date(notif.createdAt).toLocaleDateString()}
									</span>
								</div>
								<p className="text-sm text-on-surface-variant mt-1">{notif.description}</p>
								{notif.routeName && (
									<span className="inline-block text-xs mt-2 px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
										{notif.routeName}
									</span>
								)}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
