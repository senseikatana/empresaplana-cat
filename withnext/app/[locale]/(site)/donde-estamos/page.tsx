import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type PageProps = {
	params: Promise<{ locale: string }>;
};

type Office = {
	id: string;
	name: string;
	address: string;
	city: string;
	phone?: string;
	type: "central" | "delegation";
};

const staticOffices: Office[] = [
	{
		id: "central",
		name: "Oficina Central",
		address: "Polígono Industrial Riu Clar, parcela 145-155",
		city: "43006 TARRAGONA",
		phone: "+34 977 553 680",
		type: "central",
	},
	{
		id: "tarragona",
		name: "Base Tarragona",
		address: "C/ Colom, 29",
		city: "43001 TARRAGONA",
		type: "delegation",
	},
	{
		id: "reus",
		name: "Base Reus",
		address: "C/ Sabaters, 5, Pol. Ind. CIM El Camp",
		city: "43204 REUS",
		type: "delegation",
	},
	{
		id: "garraf",
		name: "Base Garraf",
		address: "C/ Mas d'en Borràs, 5, Pol. Ind. Masia d'en Notari",
		city: "08800 VILANOVA I LA GELTRÚ",
		type: "delegation",
	},
	{
		id: "calafell",
		name: "Base Calafell",
		address: "C/ Cobertera, 6, Parc Empresarial de Calafell",
		city: "43820 CALAFELL",
		type: "delegation",
	},
	{
		id: "barcelona",
		name: "Base Barcelona",
		address: "C/ Botànica, 135, Pol. Pedrosa",
		city: "08908 L'HOSPITALET DE LLOBREGAT",
		type: "delegation",
	},
	{
		id: "hospitalet",
		name: "Base L'Hospitalet",
		address: "C/ Torroja, 2, Pol. Ind. Les Tapies",
		city: "43890 L'HOSPITALET DE L'INFANT",
		type: "delegation",
	},
];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "locations" });

	return {
		title: t("title"),
		description: t("hero.subtitle"),
	};
}

export default async function DondeEstamosPage({ params }: PageProps) {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "locations" });

	const central = staticOffices.find((o) => o.type === "central");
	const delegations = staticOffices.filter((o) => o.type === "delegation");

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
				</div>
			</section>

			<section className="bg-background py-16 md:py-24">
				<div className="mx-auto max-w-[var(--spacing-container-max)] px-[var(--spacing-gutter)]">
					<div className="overflow-hidden rounded-xl ambient-shadow">
						<div className="flex h-64 items-center justify-center bg-surface-container-low md:h-96">
							<div className="text-center">
								<span className="material-symbols-outlined text-[48px] text-deep-navy/30">map</span>
								<p className="mt-2 text-[length:var(--text-body-md)] text-on-surface-variant">
									{t("mapBadge")}
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{central && (
				<section className="bg-surface-container-low py-16 md:py-20">
					<div className="mx-auto max-w-[var(--spacing-container-max)] px-[var(--spacing-gutter)]">
						<div className="rounded-xl bg-deep-navy p-8 text-white md:p-12">
							<span className="inline-block rounded-full bg-coastal-teal px-4 py-1 text-[length:var(--text-label-md)] font-semibold text-white">
								{t("central.tag")}
							</span>
							<h2 className="mt-4 text-[length:var(--text-headline-lg)] leading-[var(--text-headline-lg--line-height)] font-[var(--text-headline-lg--font-weight)]">
								{t("central.title")}
							</h2>
							<div className="mt-6 grid gap-6 md:grid-cols-3">
								<div className="flex items-start gap-3">
									<span className="material-symbols-outlined text-[24px] text-coastal-teal">
										location_on
									</span>
									<div>
										<p className="text-[length:var(--text-body-md)]">{t("central.address1")}</p>
										<p className="text-[length:var(--text-body-md)] text-white/70">
											{t("central.city")}
										</p>
									</div>
								</div>
								{central.phone && (
									<div className="flex items-start gap-3">
										<span className="material-symbols-outlined text-[24px] text-coastal-teal">
											call
										</span>
										<p className="text-[length:var(--text-body-md)]">{central.phone}</p>
									</div>
								)}
								<div className="flex items-start gap-3">
									<span className="material-symbols-outlined text-[24px] text-coastal-teal">
										schedule
									</span>
									<p className="text-[length:var(--text-body-md)]">{t("experience.subtitle")}</p>
								</div>
							</div>
						</div>
					</div>
				</section>
			)}

			<section className="bg-background py-16 md:py-24">
				<div className="mx-auto max-w-[var(--spacing-container-max)] px-[var(--spacing-gutter)]">
					<h2 className="text-center text-[length:var(--text-headline-lg)] leading-[var(--text-headline-lg--line-height)] font-[var(--text-headline-lg--font-weight)] text-deep-navy">
						{t("delegations.title")}
					</h2>

					<div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{delegations.map((office) => (
							<div
								key={office.id}
								className="rounded-xl bg-surface-container-lowest p-6 ambient-shadow transition hover:shadow-[var(--shadow-ambient-lg)]"
							>
								<div className="flex h-12 w-12 items-center justify-center rounded-full bg-deep-navy/10 text-deep-navy">
									<span className="material-symbols-outlined">location_on</span>
								</div>
								<h3 className="mt-4 text-[length:var(--text-headline-md)] leading-[var(--text-headline-md--line-height)] font-[var(--text-headline-md--font-weight)] text-deep-navy">
									{office.name}
								</h3>
								<p className="mt-2 text-[length:var(--text-body-md)] text-on-surface-variant">
									{office.address}
								</p>
								<p className="text-[length:var(--text-body-md)] text-on-surface-variant">
									{office.city}
								</p>
								{office.phone && (
									<div className="mt-3 flex items-center gap-2">
										<span className="material-symbols-outlined text-[18px] text-coastal-teal">
											call
										</span>
										<span className="text-[length:var(--text-body-md)] text-coastal-teal">
											{office.phone}
										</span>
									</div>
								)}
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="bg-deep-navy py-16 md:py-20">
				<div className="mx-auto max-w-[var(--spacing-container-max)] px-[var(--spacing-gutter)] text-center">
					<h2 className="text-[length:var(--text-headline-lg)] leading-[var(--text-headline-lg--line-height)] font-[var(--text-headline-lg--font-weight)] text-white">
						{t("experience.title")}
					</h2>
					<p className="mx-auto mt-4 max-w-2xl text-[length:var(--text-body-lg)] text-white/80">
						{t("experience.subtitle")}
					</p>
				</div>
			</section>
		</>
	);
}
