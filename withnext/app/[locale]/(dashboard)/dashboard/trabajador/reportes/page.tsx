import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { AuthError, requireCapability } from "@/lib/acl";

export default async function ReportesPage() {
	try {
		await requireCapability("fleet:view");
	} catch (e) {
		if (e instanceof AuthError) redirect("/dashboard/login");
		throw e;
	}

	const t = await getTranslations("app");

	return (
		<div className="max-w-3xl mx-auto space-y-6">
			<div>
				<h1 className="text-headline-md text-on-surface">{t("nav.reports")}</h1>
			</div>

			<div className="flex flex-col items-center justify-center py-16 text-center">
				<span className="material-symbols-outlined text-6xl text-outline mb-4">construction</span>
				<p className="text-lg font-medium text-on-surface">Próximamente</p>
				<p className="text-sm text-on-surface-variant mt-2">
					Esta sección estará disponible pronto.
				</p>
			</div>
		</div>
	);
}
