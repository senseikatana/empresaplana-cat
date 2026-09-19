import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type PageProps = {
	params: Promise<{ locale: string }>;
};

const sectionKeys = [
	"userConcept",
	"links",
	"externalLinks",
	"cookies",
	"liability",
	"technical",
	"intellectualProperty",
] as const;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "legal.legalNotice" });

	return {
		title: t("title"),
		description: t("heading"),
	};
}

export default async function AvisoLegalPage({ params }: PageProps) {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "legal.legalNotice" });

	return (
		<section className="bg-background py-16 md:py-24">
			<div className="mx-auto max-w-4xl px-[var(--spacing-gutter)]">
				<h1 className="text-[length:var(--text-display-lg)] leading-[var(--text-display-lg--line-height)] tracking-[var(--text-display-lg--letter-spacing)] font-[var(--text-display-lg--font-weight)] text-deep-navy">
					{t("title")}
				</h1>

				<div className="mt-8 rounded-xl bg-surface-container-lowest p-8 ambient-shadow md:p-12">
					<h2 className="text-[length:var(--text-headline-lg)] leading-[var(--text-headline-lg--line-height)] font-[var(--text-headline-lg--font-weight)] text-deep-navy">
						{t("heading")}
					</h2>

					<p className="mt-6 text-[length:var(--text-body-md)] leading-[var(--text-body-md--line-height)] text-on-surface-variant">
						{t("intro")}
					</p>

					<p className="mt-4 text-[length:var(--text-body-md)] leading-[var(--text-body-md--line-height)] text-on-surface-variant">
						{t("address")}
					</p>

					<div className="mt-10 space-y-8">
						{sectionKeys.map((key) => (
							<div key={key}>
								<h3 className="text-[length:var(--text-headline-md)] leading-[var(--text-headline-md--line-height)] font-[var(--text-headline-md--font-weight)] text-deep-navy">
									{t(`sectionTitles.${key}`)}
								</h3>
								<p className="mt-3 text-[length:var(--text-body-md)] leading-[var(--text-body-md--line-height)] text-on-surface-variant">
									{t(`sections.${key}`)}
								</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
