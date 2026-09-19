"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

export type TimetableData = {
	lineId: string;
	lineCode: string;
	period: string;
	directions: string[];
	directionLabels: Record<string, Record<string, string>>;
	calendars: string[];
	calendarLabels: Record<string, Record<string, string>>;
	tables: Record<string, Record<string, { stops: string[]; columns: string[]; rows: string[][] }>>;
	notes: Record<string, Record<string, string>>;
};

export function TimetableTable({ data, locale }: { data: TimetableData; locale: string }) {
	const t = useTranslations("routes.timetable");
	const [direction, setDirection] = useState(data.directions[0]);
	const [calendar, setCalendar] = useState(data.calendars[0]);

	const table = data.tables[direction]?.[calendar];
	if (!table) return null;

	const dirLabel =
		data.directionLabels[direction]?.[locale] || data.directionLabels[direction]?.es || direction;
	const calLabel =
		data.calendarLabels[calendar]?.[locale] || data.calendarLabels[calendar]?.es || calendar;

	return (
		<div className="mt-6">
			<div className="flex flex-wrap gap-2 mb-4">
				{data.directions.map((d) => (
					<button
						key={d}
						type="button"
						onClick={() => setDirection(d)}
						className={`rounded-lg px-4 py-2 text-[length:var(--text-label-md)] font-[var(--text-label-md--font-weight)] transition-colors ${
							direction === d
								? "bg-deep-navy text-white"
								: "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
						}`}
					>
						{data.directionLabels[d]?.[locale] || data.directionLabels[d]?.es || d}
					</button>
				))}
			</div>

			<div className="flex flex-wrap gap-2 mb-4">
				{data.calendars.map((c) => (
					<button
						key={c}
						type="button"
						onClick={() => setCalendar(c)}
						className={`rounded-lg px-3 py-1.5 text-[length:var(--text-body-md)] transition-colors ${
							calendar === c
								? "bg-coastal-teal text-white"
								: "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
						}`}
					>
						{data.calendarLabels[c]?.[locale] || data.calendarLabels[c]?.es || c}
					</button>
				))}
			</div>

			<p className="mb-2 text-[length:var(--text-label-md)] text-on-surface-variant">
				{dirLabel} — {calLabel}
			</p>

			<div className="overflow-x-auto rounded-lg border border-outline-variant">
				<table className="w-full border-collapse text-[length:var(--text-body-md)]">
					<thead>
						<tr className="bg-deep-navy text-white">
							<th className="sticky left-0 z-10 bg-deep-navy px-4 py-3 text-left text-[length:var(--text-label-md)] font-[var(--text-label-md--font-weight)]">
								{t("stop")}
							</th>
							{table.columns.map((col) => (
								<th
									key={col}
									className="px-3 py-3 text-center text-[length:var(--text-label-md)] font-[var(--text-label-md--font-weight)] whitespace-nowrap"
								>
									{col}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{table.rows.map((row, ri) => (
							<tr
								key={table.stops[ri]}
								className={
									ri % 2 === 0 ? "bg-surface-container-lowest" : "bg-surface-container-low"
								}
							>
								<td
									className="sticky left-0 z-10 whitespace-nowrap px-4 py-2.5 text-[length:var(--text-label-md)] font-[var(--text-label-md--font-weight)] text-on-surface"
									style={{ backgroundColor: ri % 2 === 0 ? "#ffffff" : "#f3f4f5" }}
								>
									{table.stops[ri]}
								</td>
								{row.map((cell, ci) => (
									<td
										key={`${table.columns[ci]}-${ci}`}
										className="px-3 py-2.5 text-center whitespace-nowrap"
									>
										{cell === "–" ? (
											<span className="text-on-surface-variant">–</span>
										) : (
											<span className="font-medium text-on-surface">{cell}</span>
										)}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<div className="mt-4 flex flex-wrap gap-3 text-[length:var(--text-body-md)] text-on-surface-variant">
				{Object.entries(data.notes).map(([key, note]) => (
					<span key={key} className="inline-flex items-center gap-1.5">
						<span className="inline-block h-2 w-2 rounded-full bg-coastal-teal" />
						{note[locale] || note.es || key}
					</span>
				))}
			</div>

			<p className="mt-3 text-[length:var(--text-label-md)] text-on-surface-variant">
				{t("period")}: {data.period}
			</p>
		</div>
	);
}
