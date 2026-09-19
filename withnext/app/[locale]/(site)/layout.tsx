import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CookieBanner } from "@/components/site/CookieBanner";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "meta" });

	return {
		title: t("title"),
		description: t("description"),
	};
}

export default async function SiteLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;

	return (
		<>
			<SiteHeader locale={locale} />
			<main className="min-h-screen">{children}</main>
			<SiteFooter />
			<CookieBanner />
		</>
	);
}
