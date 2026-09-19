import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type PageProps = {
	params: Promise<{ locale: string }>;
};

type ContentSection = {
	title: string | null;
	body: string | null;
};

const contentSections: ContentSection[] = [
	{ title: "definitionTitle", body: "definition" },
	{ title: null, body: "definitionBody" },
	{ title: "typesTitle", body: null },
	{ title: "typesByTime", body: null },
	{ title: null, body: "sessionCookies" },
	{ title: null, body: "persistentCookies" },
	{ title: "typesByPurpose", body: null },
	{ title: null, body: "ownCookies" },
	{ title: null, body: "thirdPartyCookies" },
	{ title: null, body: "technicalCookies" },
	{ title: null, body: "analyticsCookies" },
	{ title: null, body: "advertisingCookies" },
	{ title: "configureTitle", body: "configure" },
	{ title: null, body: "configureHelp" },
	{ title: "thirdPartyTitle", body: "googleCookies" },
];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({
		locale,
		namespace: "legal.cookiePolicy",
	});

	return {
		title: t("title"),
		description: t("heading"),
	};
}

export default async function PoliticaCookiesPage({ params }: PageProps) {
	const { locale } = await params;
	const t = await getTranslations({
		locale,
		namespace: "legal.cookiePolicy",
	});

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

					<div className="mt-8 space-y-6">
						{contentSections.map((section) => {
							const key = section.title || section.body || "";

							if (section.title && !section.body) {
								return (
									<h3
										key={key}
										className="text-[length:var(--text-headline-md)] leading-[var(--text-headline-md--line-height)] font-[var(--text-headline-md--font-weight)] text-deep-navy"
									>
										{t(section.title)}
									</h3>
								);
							}

							if (section.body) {
								return (
									<div key={key}>
										{section.title && (
											<h3 className="text-[length:var(--text-headline-md)] leading-[var(--text-headline-md--line-height)] font-[var(--text-headline-md--font-weight)] text-deep-navy">
												{t(section.title)}
											</h3>
										)}
										<p
											className={
												section.title
													? "mt-3 text-[length:var(--text-body-md)] leading-[var(--text-body-md--line-height)] text-on-surface-variant"
													: "text-[length:var(--text-body-md)] leading-[var(--text-body-md--line-height)] text-on-surface-variant"
											}
										>
											{t(section.body)}
										</p>
									</div>
								);
							}

							return null;
						})}
					</div>
				</div>
			</div>
		</section>
	);
}
