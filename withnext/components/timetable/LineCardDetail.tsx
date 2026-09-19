"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import type { TimetableData } from "./TimetableTable";

const TIMETABLE_MAP: Record<string, () => Promise<TimetableData>> = {
	tarragonaBarcelona: () =>
		import("@/app/data/horarios/tarragona-barcelona.json").then((m) => m.default as TimetableData),
};

export function LineCardDetail({
	lineId,
	locale,
	pdfUrl,
}: {
	lineId: string;
	locale: string;
	pdfUrl: string;
}) {
	const t = useTranslations("routes.timetable");
	const [expanded, setExpanded] = useState(false);
	const [data, setData] = useState<TimetableData | null>(null);
	const [loading, setLoading] = useState(false);

	const hasTimetable = lineId in TIMETABLE_MAP;

	if (!hasTimetable) {
		return (
			<a
				href={pdfUrl}
				target="_blank"
				rel="noopener noreferrer"
				className="inline-flex items-center gap-2 rounded-lg bg-energetic-orange px-4 py-2 text-[length:var(--text-button)] font-[var(--text-button--font-weight)] text-white transition-colors hover:bg-orange-600"
			>
				<span className="material-symbols-outlined text-[20px]">download</span>
				{t("downloadPdf")}
			</a>
		);
	}

	const handleExpand = async () => {
		if (expanded) {
			setExpanded(false);
			return;
		}
		setExpanded(true);
		if (!data) {
			setLoading(true);
			try {
				const loaded = await TIMETABLE_MAP[lineId]();
				setData(loaded);
			} catch {
				setData(null);
			} finally {
				setLoading(false);
			}
		}
	};

	return (
		<div>
			<div className="flex flex-wrap gap-3">
				<button
					type="button"
					onClick={handleExpand}
					className="inline-flex items-center gap-2 rounded-lg bg-deep-navy px-4 py-2 text-[length:var(--text-button)] font-[var(--text-button--font-weight)] text-white transition-colors hover:bg-navy-800"
				>
					<span className="material-symbols-outlined text-[20px]">
						{expanded ? "expand_less" : "expand_more"}
					</span>
					{expanded ? t("hideTimetable") : t("showTimetable")}
				</button>
				<a
					href={pdfUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex items-center gap-2 rounded-lg bg-energetic-orange px-4 py-2 text-[length:var(--text-button)] font-[var(--text-button--font-weight)] text-white transition-colors hover:bg-orange-600"
				>
					<span className="material-symbols-outlined text-[20px]">download</span>
					{t("downloadPdf")}
				</a>
			</div>

			{expanded && (
				<div className="mt-4">
					{loading ? (
						<div className="flex items-center gap-3 py-8 text-on-surface-variant">
							<span className="material-symbols-outlined animate-spin text-[24px]">
								progress_activity
							</span>
							{t("loading")}
						</div>
					) : data ? (
						<TimetableTableLazy data={data} locale={locale} />
					) : (
						<p className="py-8 text-on-surface-variant">{t("error")}</p>
					)}
				</div>
			)}
		</div>
	);
}

function TimetableTableLazy({ data, locale }: { data: TimetableData; locale: string }) {
	const { TimetableTable } = require("./TimetableTable");
	return <TimetableTable data={data} locale={locale} />;
}
