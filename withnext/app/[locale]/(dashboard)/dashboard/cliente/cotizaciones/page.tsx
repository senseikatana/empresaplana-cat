import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getSessionUser } from "@/lib/auth";

interface Budget {
	id: number;
	trip: string;
	status: string;
	createdAt: string;
	updatedAt: string;
}

export default async function CotizacionesPage() {
	const user = await getSessionUser();
	if (!user) redirect("/dashboard/login");

	const t = await getTranslations("app");

	let budgets: Budget[] = [];
	try {
		const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/intranet/budgets`, {
			headers: { Cookie: "" },
			cache: "no-store",
		});
		if (res.ok) {
			const data = await res.json();
			budgets = data?.data ?? data ?? [];
		}
	} catch {}

	return (
		<div className="max-w-3xl mx-auto space-y-6">
			<div>
				<h1 className="text-headline-md text-on-surface">{t("client.myBudgets")}</h1>
				<p className="text-sm text-on-surface-variant mt-1">{t("client.historyDesc")}</p>
			</div>

			{budgets.length === 0 ? (
				<div className="text-center py-12">
					<span className="material-symbols-outlined text-5xl text-outline">request_quote</span>
					<p className="text-on-surface-variant mt-4">{t("client.noBudgets")}</p>
					<p className="text-sm text-on-surface-variant mt-1">{t("client.noBudgetsDesc")}</p>
				</div>
			) : (
				<div className="space-y-3">
					{budgets.map((budget) => (
						<div key={budget.id} className="p-4 bg-surface-container-lowest rounded-xl shadow-sm">
							<div className="flex items-center justify-between">
								<div>
									<p className="font-medium text-on-surface">{budget.trip}</p>
									<p className="text-xs text-on-surface-variant mt-1">
										{t("client.sentOn")} {new Date(budget.createdAt).toLocaleDateString()}
									</p>
								</div>
								<span className="text-xs px-3 py-1 rounded-full bg-surface-container text-on-surface-variant capitalize">
									{budget.status}
								</span>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
