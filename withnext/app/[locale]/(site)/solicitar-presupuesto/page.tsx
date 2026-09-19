import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import presupuestoData from "@/app/data/presupuesto.json";
import { BudgetForm } from "./BudgetForm";

type PageProps = {
	params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "discretionary" });

	return {
		title:
			presupuestoData.title[locale as keyof typeof presupuestoData.title] ||
			presupuestoData.title.es,
		description: t("hero.subtitle"),
	};
}

export default async function SolicitarPresupuestoPage({ params }: PageProps) {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "discretionary" });
	const currentLocale = locale in presupuestoData.title ? locale : "es";

	return (
		<>
			<section className="bg-deep-navy text-white">
				<div className="mx-auto max-w-[var(--spacing-container-max)] px-[var(--spacing-gutter)] py-20 md:py-28">
					<h1 className="text-[length:var(--text-display-lg)] leading-[var(--text-display-lg--line-height)] tracking-[var(--text-display-lg--letter-spacing)] font-[var(--text-display-lg--font-weight)]">
						{presupuestoData.title[currentLocale as keyof typeof presupuestoData.title]}
					</h1>
					<p className="mt-4 max-w-3xl text-[length:var(--text-body-lg)] leading-[var(--text-body-lg--line-height)] text-white/80">
						{t("hero.subtitle")}
					</p>
				</div>
			</section>

			<section className="bg-background py-16 md:py-24">
				<div className="mx-auto max-w-3xl px-[var(--spacing-gutter)]">
					<BudgetForm />
				</div>
			</section>
		</>
	);
}
