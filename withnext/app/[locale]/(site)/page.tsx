import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import popularLines from "@/app/data/popular-lines.json";

type PageProps = {
	params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { locale } = await params;
	const tMeta = await getTranslations({ locale, namespace: "meta" });

	return {
		title: tMeta("title"),
		description: tMeta("description"),
	};
}

export default async function HomePage({ params }: PageProps) {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "homeVariant1" });
	const tContent = await getTranslations({ locale, namespace: "homeContent" });

	return (
		<>
			<section className="bg-deep-navy text-white">
				<div className="mx-auto max-w-[var(--spacing-container-max)] px-[var(--spacing-gutter)] py-20 md:py-28">
					<div className="grid gap-12 lg:grid-cols-2 lg:items-center">
						<div>
							<h1 className="text-[length:var(--text-display-lg)] leading-[var(--text-display-lg--line-height)] tracking-[var(--text-display-lg--letter-spacing)] font-[var(--text-display-lg--font-weight)]">
								{t("booking.origin")}
							</h1>
							<p className="mt-4 text-[length:var(--text-body-lg)] leading-[var(--text-body-lg--line-height)] text-white/80">
								{tContent("airportPromo.subtitle")}
							</p>
						</div>

						<div className="glass-panel rounded-2xl p-6 ambient-shadow">
							<div className="flex gap-1 border-b border-outline-variant pb-4">
								<span className="rounded-full bg-deep-navy px-4 py-1.5 text-[length:var(--text-label-md)] text-white">
									{t("booking.tabs.booking")}
								</span>
								<span className="rounded-full px-4 py-1.5 text-[length:var(--text-label-md)] text-on-surface-variant">
									{t("booking.tabs.destination")}
								</span>
								<span className="rounded-full px-4 py-1.5 text-[length:var(--text-label-md)] text-on-surface-variant">
									{t("booking.tabs.passengers")}
								</span>
							</div>

							<form className="mt-6 space-y-4">
								<div>
									<label
										htmlFor="booking-origin"
										className="mb-1 block text-[length:var(--text-label-md)] text-on-surface-variant"
									>
										{t("booking.origin")}
									</label>
									<input
										id="booking-origin"
										type="text"
										placeholder={t("booking.originPlaceholder")}
										className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 text-[length:var(--text-body-md)] outline-none focus:border-coastal-teal focus:ring-2 focus:ring-coastal-teal/20"
									/>
								</div>
								<div>
									<label
										htmlFor="booking-destination"
										className="mb-1 block text-[length:var(--text-label-md)] text-on-surface-variant"
									>
										{t("booking.destination")}
									</label>
									<input
										id="booking-destination"
										type="text"
										placeholder={t("booking.destinationPlaceholder")}
										className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 text-[length:var(--text-body-md)] outline-none focus:border-coastal-teal focus:ring-2 focus:ring-coastal-teal/20"
									/>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<label
											htmlFor="booking-date"
											className="mb-1 block text-[length:var(--text-label-md)] text-on-surface-variant"
										>
											{t("booking.date")}
										</label>
										<input
											id="booking-date"
											type="date"
											className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 text-[length:var(--text-body-md)] outline-none focus:border-coastal-teal focus:ring-2 focus:ring-coastal-teal/20"
										/>
									</div>
									<div>
										<label
											htmlFor="booking-passengers"
											className="mb-1 block text-[length:var(--text-label-md)] text-on-surface-variant"
										>
											{t("booking.passengers")}
										</label>
										<select
											id="booking-passengers"
											className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 text-[length:var(--text-body-md)] outline-none focus:border-coastal-teal focus:ring-2 focus:ring-coastal-teal/20"
										>
											<option>1</option>
											<option>2</option>
											<option>3</option>
											<option>4+</option>
										</select>
									</div>
								</div>
								<button
									type="submit"
									className="w-full rounded-lg bg-energetic-orange px-6 py-3.5 text-[length:var(--text-button)] leading-[var(--text-button--line-height)] tracking-[var(--text-button--letter-spacing)] font-[var(--text-button--font-weight)] text-white transition hover:brightness-110"
								>
									{t("booking.search")}
								</button>
							</form>
						</div>
					</div>
				</div>
			</section>

			<section className="bg-background py-16 md:py-24">
				<div className="mx-auto max-w-[var(--spacing-container-max)] px-[var(--spacing-gutter)]">
					<div className="text-center">
						<h2 className="text-[length:var(--text-headline-lg)] leading-[var(--text-headline-lg--line-height)] font-[var(--text-headline-lg--font-weight)] text-deep-navy">
							{t("routes.title")}
						</h2>
						<p className="mt-2 text-[length:var(--text-body-lg)] text-on-surface-variant">
							{tContent("valueProps.title")}
						</p>
					</div>

					<div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{popularLines.lines.slice(0, 6).map((line) => (
							<div
								key={line.id}
								className="group rounded-xl bg-surface-container-lowest p-6 ambient-shadow transition hover:shadow-[var(--shadow-ambient-lg)]"
							>
								<div className="flex h-12 w-12 items-center justify-center rounded-full bg-deep-navy/10 text-deep-navy">
									<span className="material-symbols-outlined">{line.icon || "directions_bus"}</span>
								</div>
								<h3 className="mt-4 text-[length:var(--text-headline-md)] leading-[var(--text-headline-md--line-height)] font-[var(--text-headline-md--font-weight)] text-deep-navy">
									{line.name}
								</h3>
								<p className="mt-1 text-[length:var(--text-body-md)] text-on-surface-variant">
									{line.origin} → {line.destination}
								</p>
								<div className="mt-4 flex items-center justify-between">
									<span className="text-[length:var(--text-body-md)] font-semibold text-coastal-teal">
										{t("routes.startingFrom")} {t("routes.price")}
									</span>
									<a
										href={line.pdfUrls[locale as keyof typeof line.pdfUrls] || line.pdfUrls.es}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center gap-1 text-[length:var(--text-label-md)] font-semibold text-deep-navy transition hover:text-coastal-teal"
									>
										<span className="material-symbols-outlined text-[20px]">download</span>
										PDF
									</a>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="bg-surface-container-low py-16 md:py-24">
				<div className="mx-auto max-w-[var(--spacing-container-max)] px-[var(--spacing-gutter)]">
					<div className="grid gap-8 md:grid-cols-3">
						{(
							Object.keys(
								tContent("valueProps.items") as unknown as Record<string, unknown>,
							) as string[]
						).map((key) => (
							<div key={key} className="text-center">
								<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-coastal-teal/10 text-coastal-teal">
									<span className="material-symbols-outlined text-[32px]">
										{key === "routes"
											? "route"
											: key === "accessibility"
												? "accessible"
												: key === "fleet"
													? "directions_bus"
													: "support_agent"}
									</span>
								</div>
								<h3 className="mt-4 text-[length:var(--text-headline-md)] leading-[var(--text-headline-md--line-height)] font-[var(--text-headline-md--font-weight)] text-deep-navy">
									{tContent(`valueProps.items.${key}.title`)}
								</h3>
								<p className="mt-2 text-[length:var(--text-body-md)] text-on-surface-variant">
									{tContent(`valueProps.items.${key}.desc`)}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="bg-deep-navy py-16 md:py-20">
				<div className="mx-auto max-w-[var(--spacing-container-max)] px-[var(--spacing-gutter)] text-center">
					<h2 className="text-[length:var(--text-headline-lg)] leading-[var(--text-headline-lg--line-height)] font-[var(--text-headline-lg--font-weight)] text-white">
						{tContent("coachRental.title")}
					</h2>
					<p className="mx-auto mt-4 max-w-2xl text-[length:var(--text-body-lg)] text-white/80">
						{tContent("coachRental.subtitle")}
					</p>
					<Link
						href={`/${locale}/solicitar-presupuesto`}
						className="mt-8 inline-block rounded-lg bg-energetic-orange px-8 py-4 text-[length:var(--text-button)] leading-[var(--text-button--line-height)] tracking-[var(--text-button--letter-spacing)] font-[var(--text-button--font-weight)] text-white transition hover:brightness-110"
					>
						{tContent("coachRental.quoteCta")}
					</Link>
				</div>
			</section>

			<section className="bg-background py-12">
				<div className="mx-auto max-w-[var(--spacing-container-max)] px-[var(--spacing-gutter)] text-center">
					<p className="text-[length:var(--text-label-md)] text-on-surface-variant">
						{tContent("fundedBy.title")}
					</p>
					<div className="mt-4 flex flex-wrap items-center justify-center gap-6 text-[length:var(--text-body-md)] text-on-surface-variant">
						{(tContent("fundedBy.items") as unknown as string[]).map((item: string) => (
							<span key={item}>{item}</span>
						))}
					</div>
				</div>
			</section>
		</>
	);
}
