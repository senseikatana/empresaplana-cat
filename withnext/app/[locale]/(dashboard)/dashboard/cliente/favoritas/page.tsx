"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

interface Favorite {
	id: number;
	routeId: number;
	routeName: string;
	origin: string;
	destination: string;
}

export default function FavoritasPage() {
	const t = useTranslations("app");
	const [favorites, setFavorites] = useState<Favorite[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch("/intranet/favorites")
			.then((r) => (r.ok ? r.json() : []))
			.then((data) => setFavorites(data?.data ?? data ?? []))
			.catch(() => {})
			.finally(() => setLoading(false));
	}, []);

	const toggleFavorite = async (routeId: number) => {
		try {
			const res = await fetch("/intranet/favorites", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ routeId }),
			});
			if (res.ok) {
				setFavorites((prev) => prev.filter((f) => f.routeId !== routeId));
			}
		} catch {}
	};

	return (
		<div className="max-w-3xl mx-auto space-y-6">
			<div>
				<h1 className="text-headline-md text-on-surface">{t("panel.favorites")}</h1>
			</div>

			{loading ? (
				<div className="text-center py-12 text-on-surface-variant">…</div>
			) : favorites.length === 0 ? (
				<div className="text-center py-12">
					<span className="material-symbols-outlined text-5xl text-outline">favorite</span>
					<p className="text-on-surface-variant mt-4">{t("panel.favoritesEmpty")}</p>
				</div>
			) : (
				<div className="space-y-3">
					{favorites.map((fav) => (
						<div
							key={fav.id}
							className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-xl shadow-sm"
						>
							<div>
								<p className="font-medium text-on-surface">{fav.routeName}</p>
								<p className="text-sm text-on-surface-variant">
									{fav.origin} → {fav.destination}
								</p>
							</div>
							<button
								onClick={() => toggleFavorite(fav.routeId)}
								className="material-symbols-outlined text-energetic-orange text-xl hover:scale-110 transition-transform icon-filled"
							>
								favorite
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
