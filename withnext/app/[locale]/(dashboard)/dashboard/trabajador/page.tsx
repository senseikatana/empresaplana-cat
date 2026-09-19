import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { AuthError, requireCapability } from "@/lib/acl";
import type { SessionUser } from "@/lib/auth";

export default async function TrabajadorPage() {
	let user: SessionUser;
	try {
		user = await requireCapability("fleet:view");
	} catch (e) {
		if (e instanceof AuthError) redirect("/dashboard/login");
		throw e;
	}

	const t = await getTranslations("app");

	const shortcuts = [
		{
			href: "/dashboard/trabajador/lineas",
			icon: "directions_bus",
			label: t("worker.linesTitle"),
			desc: t("worker.linesDesc"),
		},
		{
			href: "/dashboard/trabajador/incidencias",
			icon: "warning",
			label: t("worker.incidents"),
			desc: t("worker.incidentsDesc"),
		},
		{
			href: "/dashboard/trabajador/reportes",
			icon: "assessment",
			label: t("nav.reports"),
			desc: t("worker.reportsDesc"),
		},
		{
			href: "/dashboard/mensajes",
			icon: "chat",
			label: t("panel.messages"),
			desc: t("panel.messagesSubtitle"),
		},
	];

	return (
		<div className="max-w-3xl mx-auto space-y-8">
			<div>
				<h1 className="text-headline-md text-on-surface">
					{t("client.greeting", { name: user.username })}
				</h1>
				<p className="text-sm text-on-surface-variant mt-1">{t("role.worker")}</p>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				{shortcuts.map((item) => (
					<Link
						key={item.href}
						href={item.href}
						className="flex items-start gap-4 p-5 bg-surface-container-lowest rounded-2xl shadow-sm hover:shadow-md transition-shadow"
					>
						<span className="material-symbols-outlined text-2xl text-deep-navy mt-0.5">
							{item.icon}
						</span>
						<div>
							<p className="font-medium text-on-surface">{item.label}</p>
							<p className="text-sm text-on-surface-variant mt-1">{item.desc}</p>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
}
