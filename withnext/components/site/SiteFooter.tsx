import { getTranslations } from "next-intl/server";
import { contact } from "@/app/data/contact";
import { Link } from "@/i18n/navigation";

const FOOTER_LINKS = [
	{ href: "/rutes", labelKey: "routes" },
	{ href: "/serveis", labelKey: "services" },
	{ href: "/empresa", labelKey: "company" },
	{ href: "/avis-legal", labelKey: "legalNotice" },
	{ href: "/politica-privacidad", labelKey: "privacy" },
	{ href: "/politica-cookies", labelKey: "cookies" },
] as const;

const SOCIAL_LINKS = [
	{ href: contact.social.facebook, icon: "facebook", label: "Facebook" },
	{ href: contact.social.twitter, icon: "close", label: "Twitter / X" },
	{ href: contact.social.youtube, icon: "play_circle", label: "YouTube" },
	{ href: contact.social.instagram, icon: "photo_camera", label: "Instagram" },
] as const;

export async function SiteFooter() {
	const t = await getTranslations("footer");

	return (
		<footer className="bg-deep-navy text-white">
			<div className="mx-auto grid max-w-[var(--container-container-max)] gap-12 px-[var(--spacing-gutter)] py-16 md:grid-cols-3">
				<div>
					<p className="text-headline-lg font-bold">Empresa Plana</p>
					<address className="mt-4 flex flex-col gap-2 text-body-md not-italic text-white/80">
						<span>{contact.address.street}</span>
						<span>{contact.address.city}</span>
						<span>{contact.address.province}</span>
					</address>
					<a
						href={`tel:${contact.generalPhone.replace(/\s/g, "")}`}
						className="mt-4 flex items-center gap-2 text-body-md text-coastal-teal transition hover:text-white"
					>
						<span className="material-symbols-outlined text-[20px]">phone</span>
						{contact.generalPhone}
					</a>
				</div>

				<div>
					<p className="text-label-md font-semibold uppercase tracking-wider text-white/60">
						{t("links")}
					</p>
					<ul className="mt-4 flex flex-col gap-3">
						{FOOTER_LINKS.map((item) => (
							<li key={item.href}>
								<Link
									href={item.href}
									className="text-body-md text-white/80 transition hover:text-coastal-teal"
								>
									{t(item.labelKey)}
								</Link>
							</li>
						))}
					</ul>
				</div>

				<div>
					<p className="text-label-md font-semibold uppercase tracking-wider text-white/60">
						{t("social")}
					</p>
					<ul className="mt-4 flex flex-col gap-3">
						{SOCIAL_LINKS.map((item) => (
							<li key={item.href}>
								<a
									href={item.href}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-2 text-body-md text-white/80 transition hover:text-coastal-teal"
								>
									<span className="material-symbols-outlined text-[20px]">{item.icon}</span>
									{item.label}
								</a>
							</li>
						))}
					</ul>
				</div>
			</div>

			<div className="border-t border-white/10">
				<p className="mx-auto max-w-[var(--container-container-max)] px-[var(--spacing-gutter)] py-6 text-center text-label-md text-white/50">
					&copy; 2026 Empresa Plana. {t("allRights")}
				</p>
			</div>
		</footer>
	);
}
