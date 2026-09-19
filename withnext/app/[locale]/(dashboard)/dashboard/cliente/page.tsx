import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getSessionUser } from "@/lib/auth";

export default async function ClientePage() {
	const user = await getSessionUser();
	if (!user) redirect("/dashboard/login");

	const t = await getTranslations("app");

	const shortcuts = [
		{
			href: "/dashboard/cliente/favoritas",
			icon: "favorite",
			labelKey: "favorites",
		},
		{
			href: "/dashboard/cliente/cotizaciones",
			icon: "request_quote",
			labelKey: "quotes",
		},
		{ href: "/dashboard/cliente/cuenta", icon: "person", labelKey: "account" },
		{ href: "/dashboard/mensajes", icon: "chat", labelKey: "messages" },
	];

	return (
		<div className="max-w-3xl mx-auto space-y-8">
			<div>
				<h1 className="text-headline-md text-on-surface">
					{t("client.greeting", { name: user.username })}
				</h1>
				<p className="text-sm text-on-surface-variant mt-1">{t("role.client")}</p>
			</div>

			<div className="grid grid-cols-2 gap-4">
				{shortcuts.map((item) => (
					<Link
						key={item.href}
						href={item.href}
						className="flex flex-col items-center gap-3 p-6 bg-surface-container-lowest rounded-2xl shadow-sm hover:shadow-md transition-shadow"
					>
						<span className="material-symbols-outlined text-3xl text-deep-navy">{item.icon}</span>
						<span className="text-sm font-medium text-on-surface">
							{t(`panel.${item.labelKey}`)}
						</span>
					</Link>
				))}
			</div>
		</div>
	);
}
