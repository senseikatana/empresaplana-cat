import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

type PageProps = {
	params: Promise<{ locale: string }>;
};

const serviceKeys = [
	"transfers",
	"weddings",
	"adapted",
	"mice",
	"companies",
	"school",
	"endOfYearTrips",
	"touristTrips",
	"internationalExcursions",
] as const;

const serviceIcons: Record<string, string> = {
	transfers: "flight_land",
	weddings: "celebration",
	adapted: "accessible",
	mice: "groups",
	companies: "factory",
	school: "school",
	endOfYearTrips: "emoji_transportation",
	touristTrips: "travel_explore",
	internationalExcursions: "public",
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "discretionary" });

	return {
		title: t("title"),
		description: t("hero.subtitle"),
	};
}

export default async function ServiciosDiscrecionalesPage({ params }: PageProps) {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "discretionary" });

	return (
		<>
			<section className="bg-deep-navy text-white">
				<div className="mx-auto max-w-[var(--spacing-container-max)] px-[var(--spacing-gutter)] py-20 md:py-28">
					<h1 className="text-[length:var(--text-display-lg)] leading-[var(--text-display-lg--line-height)] tracking-[var(--text-display-lg--letter-spacing)] font-[var(--text-display-lg--font-weight)]">
						{t("hero.title")}
					</h1>
					<p className="mt-4 max-w-3xl text-[length:var(--text-body-lg)] leading-[var(--text-body-lg--line-height)] text-white/80">
						{t("hero.subtitle")}
					</p>
					<Link
						href={`/${locale}/solicitar-presupuesto`}
						className="mt-8 inline-block rounded-lg bg-energetic-orange px-8 py-4 text-[length:var(--text-button)] leading-[var(--text-button--line-height)] tracking-[var(--text-button--letter-spacing)] font-[var(--text-button--font-weight)] text-white transition hover:brightness-110"
					>
						{t("hero.cta")}
					</Link>
				</div>
			</section>

			<section className="bg-background py-16 md:py-24">
				<div className="mx-auto max-w-[var(--spacing-container-max)] px-[var(--spacing-gutter)]">
					<div className="text-center">
						<h2 className="text-[length:var(--text-headline-lg)] leading-[var(--text-headline-lg--line-height)] font-[var(--text-headline-lg--font-weight)] text-deep-navy">
							{t("services.title")}
						</h2>
						<p className="mx-auto mt-2 max-w-2xl text-[length:var(--text-body-lg)] text-on-surface-variant">
							{t("services.subtitle")}
						</p>
					</div>

					<div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{serviceKeys.map((key) => (
							<Link
								key={key}
								href={`/${locale}/servicios/${key}`}
								className="group rounded-xl bg-surface-container-lowest p-6 ambient-shadow transition hover:shadow-[var(--shadow-ambient-lg)] hover:-translate-y-1"
							>
								<div className="flex h-14 w-14 items-center justify-center rounded-full bg-coastal-teal/10 text-coastal-teal transition group-hover:bg-coastal-teal group-hover:text-white">
									<span className="material-symbols-outlined text-[28px]">{serviceIcons[key]}</span>
								</div>
								{t(`services.cards.${key}.tag`) && (
									<span className="mt-4 inline-block rounded-full bg-coastal-teal/10 px-3 py-1 text-[length:var(--text-label-md)] text-coastal-teal">
										{t(`services.cards.${key}.tag`)}
									</span>
								)}
								<h3 className="mt-3 text-[length:var(--text-headline-md)] leading-[var(--text-headline-md--line-height)] font-[var(--text-headline-md--font-weight)] text-deep-navy">
									{t(`services.cards.${key}.title`)}
								</h3>
								<p className="mt-2 text-[length:var(--text-body-md)] text-on-surface-variant">
									{t(`services.cards.${key}.desc`)}
								</p>
								<span className="mt-4 inline-flex items-center gap-1 text-[length:var(--text-label-md)] font-semibold text-coastal-teal transition group-hover:gap-2">
									{t("services.viewDetails")}
								</span>
							</Link>
						))}
					</div>
				</div>
			</section>

			<section className="bg-deep-navy py-16 md:py-20">
				<div className="mx-auto max-w-[var(--spacing-container-max)] px-[var(--spacing-gutter)]">
					<div className="text-center">
						<h2 className="text-[length:var(--text-headline-lg)] leading-[var(--text-headline-lg--line-height)] font-[var(--text-headline-lg--font-weight)] text-white">
							{t("cta.contactTitle")}
						</h2>
						<p className="mx-auto mt-4 max-w-2xl text-[length:var(--text-body-lg)] text-white/80">
							{t("cta.subtitle")}
						</p>
					</div>

					<div className="mt-10 grid gap-6 md:grid-cols-2">
						<div className="rounded-xl bg-white/10 p-6 text-center">
							<span className="material-symbols-outlined text-[32px] text-coastal-teal">call</span>
							<p className="mt-2 text-[length:var(--text-label-md)] text-white/70">
								{t("cta.areaTarragona")}
							</p>
							<p className="mt-1 text-[length:var(--text-headline-md)] font-semibold text-white">
								{t("cta.phoneTarragona")}
							</p>
						</div>
						<div className="rounded-xl bg-white/10 p-6 text-center">
							<span className="material-symbols-outlined text-[32px] text-coastal-teal">call</span>
							<p className="mt-2 text-[length:var(--text-label-md)] text-white/70">
								{t("cta.areaBarcelona")}
							</p>
							<p className="mt-1 text-[length:var(--text-headline-md)] font-semibold text-white">
								{t("cta.phoneBarcelona")}
							</p>
						</div>
					</div>

					<div className="mt-8 text-center">
						<Link
							href={`/${locale}/solicitar-presupuesto`}
							className="inline-block rounded-lg bg-energetic-orange px-8 py-4 text-[length:var(--text-button)] leading-[var(--text-button--line-height)] tracking-[var(--text-button--letter-spacing)] font-[var(--text-button--font-weight)] text-white transition hover:brightness-110"
						>
							{t("cta.submit")}
						</Link>
					</div>
				</div>
			</section>
		</>
	);
}
