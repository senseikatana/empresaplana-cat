"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "ep-cookies-accepted";

export function CookieBanner() {
	const t = useTranslations("cookies");
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		if (typeof window === "undefined") return;
		const stored = localStorage.getItem(STORAGE_KEY);
		if (!stored) setVisible(true);
	}, []);

	const accept = useCallback(() => {
		localStorage.setItem(STORAGE_KEY, "accepted");
		setVisible(false);
	}, []);

	const reject = useCallback(() => {
		localStorage.setItem(STORAGE_KEY, "rejected");
		setVisible(false);
	}, []);

	const openSettings = useCallback(() => {
		window.dispatchEvent(new CustomEvent("open-cookie-settings"));
	}, []);

	useEffect(() => {
		function handleOpen() {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (!stored) setVisible(true);
		}
		window.addEventListener("open-cookie-settings", handleOpen);
		return () => window.removeEventListener("open-cookie-settings", handleOpen);
	}, []);

	if (!visible) return null;

	return (
		<div className="fixed inset-x-0 bottom-0 z-50 border-t border-outline-variant bg-surface-container-lowest p-[var(--spacing-gutter)] ambient-shadow">
			<div className="mx-auto flex max-w-[var(--container-container-max)] flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
				<p className="max-w-2xl text-body-md text-on-surface-variant">{t("intro")}</p>
				<div className="flex shrink-0 gap-3">
					<button
						type="button"
						onClick={accept}
						className="rounded-lg bg-deep-navy px-5 py-2 text-button font-semibold text-white transition hover:opacity-90"
					>
						{t("accept")}
					</button>
					<button
						type="button"
						onClick={reject}
						className="rounded-lg border border-outline px-5 py-2 text-button font-semibold text-on-surface transition hover:bg-surface-container"
					>
						{t("reject")}
					</button>
					<button
						type="button"
						onClick={openSettings}
						className="rounded-lg px-5 py-2 text-button font-semibold text-coastal-teal transition hover:bg-surface-container"
					>
						{t("settings")}
					</button>
				</div>
			</div>
		</div>
	);
}
