"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function RegisterPage() {
	const t = useTranslations("app.register");
	const router = useRouter();

	const [name, setName] = useState("");
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);
		try {
			const res = await fetch("/intranet/auth/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, username, email, password }),
			});
			if (!res.ok) {
				const data = await res.json().catch(() => null);
				setError(data?.error?.message === "taken" ? t("taken") : t("invalid"));
				return;
			}
			router.push("/dashboard");
		} catch {
			setError(t("invalid"));
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-[80vh] px-4">
			<div className="w-full max-w-md">
				<div className="text-center mb-8">
					<span className="material-symbols-outlined text-5xl text-deep-navy">person_add</span>
					<h1 className="text-2xl font-bold mt-4 text-on-surface">{t("title")}</h1>
					<p className="text-sm text-on-surface-variant mt-2">{t("subtitle")}</p>
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
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-on-surface mb-1.5">
							{t("username")}
						</label>
						<input
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-surface text-on-surface focus:outline-none focus:ring-2 focus:ring-deep-navy"
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-on-surface mb-1.5">{t("email")}</label>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-surface text-on-surface focus:outline-none focus:ring-2 focus:ring-deep-navy"
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-on-surface mb-1.5">
							{t("password")}
						</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-surface text-on-surface focus:outline-none focus:ring-2 focus:ring-deep-navy"
							required
							minLength={6}
						/>
					</div>

					{error && (
						<p className="text-sm text-error bg-error-container rounded-lg px-4 py-2">{error}</p>
					)}

					<button
						type="submit"
						disabled={loading}
						className="w-full py-2.5 bg-deep-navy text-on-primary rounded-lg font-semibold hover:bg-primary transition-colors disabled:opacity-50"
					>
						{loading ? "…" : t("submit")}
					</button>
				</form>

				<p className="text-center text-sm text-on-surface-variant mt-6">
					{t("haveAccount")}{" "}
					<Link href="/dashboard/login" className="text-deep-navy font-medium hover:underline">
						{t("login")}
					</Link>
				</p>
			</div>
		</div>
	);
}
