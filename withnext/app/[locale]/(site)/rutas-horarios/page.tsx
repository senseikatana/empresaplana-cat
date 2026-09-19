import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import popularLines from "@/app/data/popular-lines.json";
import stopsData from "@/app/data/stops.json";
import { LineCardDetail } from "@/components/timetable/LineCardDetail";

type PageProps = {
	params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "routes" });

	return {
		title: t("title"),
		description: t("hero.subtitle"),
	};
}

export default async function RutasHorariosPage({ params }: PageProps) {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "routes" });

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
					<div className="glass-panel rounded-2xl p-8 ambient-shadow">
						<h2 className="text-[length:var(--text-headline-lg)] leading-[var(--text-headline-lg--line-height)] font-[var(--text-headline-lg--font-weight)] text-deep-navy">
							{t("search.title")}
						</h2>

						<form className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
							<div>
								<label
									htmlFor="search-origin"
									className="mb-1 block text-[length:var(--text-label-md)] text-on-surface-variant"
								>
									{t("search.originLabel")}
								</label>
								<select
									id="search-origin"
									className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 text-[length:var(--text-body-md)] outline-none focus:border-coastal-teal focus:ring-2 focus:ring-coastal-teal/20"
								>
									<option value="">{t("search.originPlaceholder")}</option>
									{stopsData.stops.map((stop) => (
										<option key={stop} value={stop}>
											{stop}
										</option>
									))}
								</select>
							</div>

							<div>
								<label
									htmlFor="search-destination"
									className="mb-1 block text-[length:var(--text-label-md)] text-on-surface-variant"
								>
									{t("search.destinationLabel")}
								</label>
								<select
									id="search-destination"
									className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 text-[length:var(--text-body-md)] outline-none focus:border-coastal-teal focus:ring-2 focus:ring-coastal-teal/20"
								>
									<option value="">{t("search.destinationPlaceholder")}</option>
									{stopsData.stops.map((stop) => (
										<option key={stop} value={stop}>
											{stop}
										</option>
									))}
								</select>
							</div>

							<div>
								<label
									htmlFor="search-date"
									className="mb-1 block text-[length:var(--text-label-md)] text-on-surface-variant"
								>
									{t("search.dateLabel")}
								</label>
								<input
									id="search-date"
									type="date"
									className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 text-[length:var(--text-body-md)] outline-none focus:border-coastal-teal focus:ring-2 focus:ring-coastal-teal/20"
								/>
							</div>

							<div>
								<label
									htmlFor="search-time"
									className="mb-1 block text-[length:var(--text-label-md)] text-on-surface-variant"
								>
									{t("search.timeLabel")}
								</label>
								<select
									id="search-time"
									className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 text-[length:var(--text-body-md)] outline-none focus:border-coastal-teal focus:ring-2 focus:ring-coastal-teal/20"
								>
									<option value="">{t("search.anyTime")}</option>
									{stopsData.timeRanges.map((range) => (
										<option key={range.value} value={range.value}>
											{range.label}
										</option>
									))}
								</select>
							</div>

							<div className="md:col-span-2 lg:col-span-4">
								<div className="flex flex-wrap items-center gap-4">
									<label className="flex items-center gap-2 text-[length:var(--text-body-md)] text-on-surface-variant">
										<input
											type="radio"
											name="routeType"
											defaultChecked
											className="accent-coastal-teal"
										/>
										{t("search.direct")}
									</label>
									<label className="flex items-center gap-2 text-[length:var(--text-body-md)] text-on-surface-variant">
										<input type="radio" name="routeType" className="accent-coastal-teal" />
										{t("search.withTransfers")}
									</label>
								</div>
							</div>

							<div className="md:col-span-2 lg:col-span-4">
								<button
									type="submit"
									className="w-full rounded-lg bg-energetic-orange px-6 py-3.5 text-[length:var(--text-button)] leading-[var(--text-button--line-height)] tracking-[var(--text-button--letter-spacing)] font-[var(--text-button--font-weight)] text-white transition hover:brightness-110 sm:w-auto"
								>
									{t("search.submit")}
								</button>
								<p className="mt-3 text-[length:var(--text-label-md)] text-on-surface-variant">
									{t("search.disclaimer")}
								</p>
							</div>
						</form>
					</div>
				</div>
			</section>

			<section className="bg-surface-container-low py-16 md:py-24">
				<div className="mx-auto max-w-[var(--spacing-container-max)] px-[var(--spacing-gutter)]">
					<div className="text-center">
						<h2 className="text-[length:var(--text-headline-lg)] leading-[var(--text-headline-lg--line-height)] font-[var(--text-headline-lg--font-weight)] text-deep-navy">
							{t("lines.title")}
						</h2>
						<p className="mt-2 text-[length:var(--text-body-lg)] text-on-surface-variant">
							{t("lines.subtitle")}
						</p>
					</div>

					<div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{popularLines.lines.map((line) => (
							<div
								key={line.id}
								className="rounded-xl bg-surface-container-lowest p-6 ambient-shadow transition hover:shadow-[var(--shadow-ambient-lg)]"
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
								<div className="mt-4">
									<LineCardDetail
										lineId={line.id}
										locale={locale}
										pdfUrl={line.pdfUrls[locale as keyof typeof line.pdfUrls] || line.pdfUrls.es}
									/>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="bg-energetic-orange/10 py-12">
				<div className="mx-auto max-w-[var(--spacing-container-max)] px-[var(--spacing-gutter)]">
					<div className="flex items-start gap-4 rounded-xl bg-surface-container-lowest p-6 ambient-shadow">
						<span className="material-symbols-outlined text-[28px] text-energetic-orange">
							warning
						</span>
						<div>
							<h3 className="text-[length:var(--text-headline-md)] leading-[var(--text-headline-md--line-height)] font-[var(--text-headline-md--font-weight)] text-deep-navy">
								{t("banner.title")}
							</h3>
							<p className="mt-2 text-[length:var(--text-body-md)] text-on-surface-variant">
								{t("banner.body")}
							</p>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
