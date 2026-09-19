"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";

const LOCALES = ["ca", "es", "en", "fr"] as const;

const NAV_LINKS = [
	{ href: "/", labelKey: "home" },
	{ href: "/rutes", labelKey: "lines" },
	{ href: "/serveis", labelKey: "services" },
	{ href: "/empresa", labelKey: "company" },
	{ href: "/contacte", labelKey: "contact" },
] as const;

export function SiteHeader({ locale }: { locale: string }) {
	const t = useTranslations("nav");
	const pathname = usePathname();
	const router = useRouter();
	const [mobileOpen, setMobileOpen] = useState(false);

	function switchLocale(next: string) {
		router.replace(pathname, { locale: next });
	}

	return (
		<header className="sticky top-0 z-50">
			<div className="bg-deep-navy text-white">
				<div className="mx-auto flex max-w-[var(--container-container-max)] items-center justify-between px-[var(--spacing-gutter)] py-2 text-label-md">
					<a
						href="tel:+34977553680"
						className="flex items-center gap-1 text-white/80 transition hover:text-white"
					>
						<span className="material-symbols-outlined text-[18px]">phone</span>
						+34 977 553 680
					</a>

					<nav aria-label="Language switcher" className="flex items-center gap-1">
						{LOCALES.map((loc) => (
							<button
								key={loc}
								onClick={() => switchLocale(loc)}
								className={`rounded px-2 py-0.5 text-label-md font-semibold transition ${
									loc === locale ? "bg-coastal-teal text-white" : "text-white/70 hover:text-white"
								}`}
							>
								{loc.toUpperCase()}
							</button>
						))}
					</nav>
				</div>
			</div>

			<div className="glass-panel ambient-shadow">
				<div className="mx-auto flex max-w-[var(--container-container-max)] items-center justify-between px-[var(--spacing-gutter)] py-4">
					<Link href="/" className="text-headline-lg font-bold text-deep-navy">
						Empresa Plana
					</Link>

					<nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
						{NAV_LINKS.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className="text-body-md font-medium text-on-surface transition hover:text-coastal-teal"
							>
								{t(item.labelKey)}
							</Link>
						))}
						<Link
							href="/reserva"
							className="rounded-lg bg-energetic-orange px-5 py-2 text-button font-semibold text-white transition hover:opacity-90"
						>
							{t("bookNow")}
						</Link>
					</nav>

					<button
						type="button"
						onClick={() => setMobileOpen(!mobileOpen)}
						className="flex items-center justify-center rounded p-2 text-on-surface transition hover:bg-surface-container md:hidden"
						aria-label={mobileOpen ? "Close menu" : "Open menu"}
						aria-expanded={mobileOpen}
					>
						<span className="material-symbols-outlined">{mobileOpen ? "close" : "menu"}</span>
					</button>
				</div>

				{mobileOpen && (
					<nav className="border-t border-outline-variant px-[var(--spacing-gutter)] py-4 md:hidden">
						<ul className="flex flex-col gap-3">
							{NAV_LINKS.map((item) => (
								<li key={item.href}>
									<Link
										href={item.href}
										onClick={() => setMobileOpen(false)}
										className="block rounded py-2 text-body-md font-medium text-on-surface transition hover:bg-surface-container hover:text-coastal-teal"
									>
										{t(item.labelKey)}
									</Link>
								</li>
							))}
							<li>
								<Link
									href="/reserva"
									onClick={() => setMobileOpen(false)}
									className="mt-2 block rounded-lg bg-energetic-orange px-5 py-2 text-center text-button font-semibold text-white transition hover:opacity-90"
								>
									{t("bookNow")}
								</Link>
							</li>
						</ul>
					</nav>
				)}
			</div>
		</header>
	);
}
