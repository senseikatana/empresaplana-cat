"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export default function CuentaPage() {
	const t = useTranslations("app.panel");
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [saving, setSaving] = useState(false);
	const [saved, setSaved] = useState(false);

	useEffect(() => {
		fetch("/intranet/me")
			.then((r) => (r.ok ? r.json() : null))
			.then((data) => {
				const user = data?.data?.user;
				if (user) {
					setName(user.name || "");
					setEmail(user.email || "");
					setPhone(user.phone || "");
				}
			})
			.catch(() => {});
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSaving(false);
		setSaved(false);
		setSaving(true);
		try {
			const body: Record<string, string> = { name, email, phone };
			if (newPassword) body.newPassword = newPassword;
			const res = await fetch("/intranet/account", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});
			if (res.ok) {
				setSaved(true);
				setNewPassword("");
			}
		} catch {
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className="max-w-xl mx-auto space-y-6">
			<div>
				<h1 className="text-headline-md text-on-surface">{t("accountTitle")}</h1>
				<p className="text-sm text-on-surface-variant mt-1">{t("accountSubtitle")}</p>
			</div>

			<form
				onSubmit={handleSubmit}
				className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm space-y-4"
			>
				<div>
					<label className="block text-sm font-medium text-on-surface mb-1.5">{t("name")}</label>
					<input
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-surface text-on-surface focus:outline-none focus:ring-2 focus:ring-deep-navy"
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-on-surface mb-1.5">{t("email")}</label>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-surface text-on-surface focus:outline-none focus:ring-2 focus:ring-deep-navy"
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-on-surface mb-1.5">{t("phone")}</label>
					<input
						type="tel"
						value={phone}
						onChange={(e) => setPhone(e.target.value)}
						className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-surface text-on-surface focus:outline-none focus:ring-2 focus:ring-deep-navy"
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-on-surface mb-1.5">
						{t("newPassword")}
					</label>
					<input
						type="password"
						value={newPassword}
						onChange={(e) => setNewPassword(e.target.value)}
						className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-surface text-on-surface focus:outline-none focus:ring-2 focus:ring-deep-navy"
						minLength={6}
						placeholder="••••••"
					/>
				</div>

				{saved && (
					<p className="text-sm text-secondary bg-secondary-container rounded-lg px-4 py-2">
						{t("saved")}
					</p>
				)}

				<button
					type="submit"
					disabled={saving}
					className="w-full py-2.5 bg-deep-navy text-on-primary rounded-lg font-semibold hover:bg-primary transition-colors disabled:opacity-50"
				>
					{saving ? "…" : t("save")}
				</button>
			</form>
		</div>
	);
}
