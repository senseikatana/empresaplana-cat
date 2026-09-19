"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Suspense, useState } from "react";

const DEMO_ACCOUNTS = [
	{ label: "asClient", username: "cliente", password: "demo123" },
	{ label: "asWorker", username: "trabajador", password: "demo123" },
	{ label: "asBoss", username: "admin", password: "demo123" },
];

function LoginForm() {
	const t = useTranslations("app.auth");
	const router = useRouter();
	const searchParams = useSearchParams();
	const rawRedirect = searchParams.get("redirect") || "/dashboard";
	const redirect =
		rawRedirect.startsWith("/") && !rawRedirect.startsWith("//") && !rawRedirect.includes(":")
			? rawRedirect
			: "/dashboard";

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const doLogin = async (user: string, pass: string) => {
		setError("");
		setLoading(true);
		try {
			const res = await fetch("/intranet/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username: user, passkey: pass }),
			});
			const data = await res.json().catch(() => null);
			if (!res.ok || !data?.ok) {
				setError(data?.error?.message || t("invalid"));
				return;
			}
			router.push(redirect);
		} catch {
			setError(t("invalid"));
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		doLogin(username, password);
	};

	return (
		<div className="flex items-center justify-center min-h-[80vh] px-4">
			<div className="w-full max-w-md">
				<div className="text-center mb-8">
					<span className="material-symbols-outlined text-5xl text-deep-navy">directions_bus</span>
					<h1 className="text-2xl font-bold mt-4 text-on-surface">{t("welcome")}</h1>
					<p className="text-sm text-on-surface-variant mt-2">{t("subtitle")}</p>
				</div>

				<form
					onSubmit={handleSubmit}
					className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm space-y-4"
				>
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
						<label className="block text-sm font-medium text-on-surface mb-1.5">
							{t("passkey")}
						</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-surface text-on-surface focus:outline-none focus:ring-2 focus:ring-deep-navy"
							required
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
						{loading ? "…" : t("login")}
					</button>
				</form>

				<div className="mt-6 bg-surface-container-low rounded-2xl p-5">
					<p className="text-xs text-on-surface-variant mb-3 text-center">{t("demoHint")}</p>
					<div className="flex flex-col gap-2">
						{DEMO_ACCOUNTS.map((acc) => (
							<button
								key={acc.username}
								onClick={() => doLogin(acc.username, acc.password)}
								disabled={loading}
								className="w-full py-2 text-sm font-medium rounded-lg border border-outline-variant bg-surface hover:bg-surface-container transition-colors disabled:opacity-50"
							>
								{t(acc.label)}
							</button>
						))}
					</div>
				</div>

				<p className="text-center text-sm text-on-surface-variant mt-6">
					<Link href="/dashboard/register" className="text-deep-navy font-medium hover:underline">
						Crear cuenta
					</Link>
				</p>
			</div>
		</div>
	);
}

export default function LoginPage() {
	return (
		<Suspense>
			<LoginForm />
		</Suspense>
	);
}
