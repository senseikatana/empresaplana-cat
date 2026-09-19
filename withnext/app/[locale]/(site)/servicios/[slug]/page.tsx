import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import servicesData from "@/app/data/services.json";

type PageProps = {
	params: Promise<{ locale: string; slug: string }>;
};

type ServiceLocale = {
	title: string;
	tagline: string;
	sectionTitle: string;
	body: string[];
	imageUrl: string;
	imageCaption: string;
};

function getServiceBySlug(slug: string) {
	return servicesData.services.find((s) => s.slug === slug);
}

function getServiceLocale(
	service: (typeof servicesData.services)[number],
	locale: string,
): ServiceLocale | null {
	const locales = service.locales as unknown as Record<string, ServiceLocale>;
	return locales[locale] || locales.es || locales.ca || null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { locale, slug } = await params;
	const service = getServiceBySlug(slug);
	if (!service) return { title: "404" };

	const data = getServiceLocale(service, locale);
	if (!data) return { title: "404" };

	return {
		title: data.title,
		description: data.tagline,
	};
}

export default async function ServicioDetailPage({ params }: PageProps) {
	const { locale, slug } = await params;
	const service = getServiceBySlug(slug);

	if (!service) {
		notFound();
	}

	const data = getServiceLocale(service, locale);

	if (!data) {
		notFound();
	}

	const t = await getTranslations({ locale, namespace: "discretionary" });

	return (
		<>
			<section className="bg-deep-navy text-white">
				<div className="mx-auto max-w-[var(--spacing-container-max)] px-[var(--spacing-gutter)] py-20 md:py-28">
					<Link
						href={`/${locale}/servicios-discrecionales`}
						className="mb-6 inline-flex items-center gap-1 text-[length:var(--text-label-md)] text-coastal-teal transition hover:text-white"
					>
						<span className="material-symbols-outlined text-[20px]">arrow_back</span>
						{t("services.title")}
					</Link>
					<h1 className="text-[length:var(--text-display-lg)] leading-[var(--text-display-lg--line-height)] tracking-[var(--text-display-lg--letter-spacing)] font-[var(--text-display-lg--font-weight)]">
						{data.title}
					</h1>
					<p className="mt-4 max-w-3xl text-[length:var(--text-body-lg)] leading-[var(--text-body-lg--line-height)] text-white/80">
						{data.tagline}
					</p>
				</div>
			</section>

			<section className="bg-background py-16 md:py-24">
				<div className="mx-auto max-w-[var(--spacing-container-max)] px-[var(--spacing-gutter)]">
					<div className="grid gap-12 lg:grid-cols-5">
						<div className="lg:col-span-3">
							<h2 className="text-[length:var(--text-headline-lg)] leading-[var(--text-headline-lg--line-height)] font-[var(--text-headline-lg--font-weight)] text-deep-navy">
								{data.sectionTitle}
							</h2>
							<div className="mt-6 space-y-4">
								{data.body.map((paragraph: string) => (
									<p
										key={paragraph.slice(0, 40)}
										className="text-[length:var(--text-body-md)] leading-[var(--text-body-md--line-height)] text-on-surface-variant"
									>
										{paragraph}
									</p>
								))}
							</div>
						</div>

						<div className="lg:col-span-2">
							{data.imageUrl && (
								<div className="overflow-hidden rounded-xl ambient-shadow">
									<Image
										src={data.imageUrl}
										alt={data.imageCaption}
										width={600}
										height={400}
										className="h-auto w-full object-cover"
									/>
								</div>
							)}

							<div className="mt-8 rounded-xl bg-coastal-teal/5 p-6">
								<h3 className="text-[length:var(--text-headline-md)] leading-[var(--text-headline-md--line-height)] font-[var(--text-headline-md--font-weight)] text-deep-navy">
									{t("cta.contactTitle")}
								</h3>
								<p className="mt-2 text-[length:var(--text-body-md)] text-on-surface-variant">
									{t("cta.subtitle")}
								</p>
								<div className="mt-4 space-y-3">
									<div className="flex items-center gap-3">
										<span className="material-symbols-outlined text-[20px] text-coastal-teal">
											call
										</span>
										<span className="text-[length:var(--text-body-md)] text-on-surface">
											{t("cta.phoneTarragona")}
										</span>
									</div>
									<div className="flex items-center gap-3">
										<span className="material-symbols-outlined text-[20px] text-coastal-teal">
											call
										</span>
										<span className="text-[length:var(--text-body-md)] text-on-surface">
											{t("cta.phoneBarcelona")}
										</span>
									</div>
								</div>
								<Link
									href={`/${locale}/solicitar-presupuesto`}
									className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-energetic-orange px-6 py-3.5 text-[length:var(--text-button)] leading-[var(--text-button--line-height)] tracking-[var(--text-button--letter-spacing)] font-[var(--text-button--font-weight)] text-white transition hover:brightness-110"
								>
									{t("cta.submit")}
								</Link>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
