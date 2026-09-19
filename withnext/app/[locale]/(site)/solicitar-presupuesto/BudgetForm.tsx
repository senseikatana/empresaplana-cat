"use client";

import { useState } from "react";
import presupuestoData from "@/app/data/presupuesto.json";

type FormState = {
	status: "idle" | "submitting" | "success" | "error";
};

export function BudgetForm() {
	const currentLocale = "es";
	const [formState, setFormState] = useState<FormState>({ status: "idle" });

	const contactFields = presupuestoData.fields.filter((f) => f.group === "contact");
	const serviceFields = presupuestoData.fields.filter((f) => f.group === "service");

	function getFieldLabel(field: (typeof presupuestoData.fields)[number]) {
		return field.labels[currentLocale as keyof typeof field.labels] || field.labels.es;
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setFormState({ status: "submitting" });

		const formData = new FormData(e.currentTarget);
		const body = Object.fromEntries(formData.entries());

		try {
			const res = await fetch("/intranet/budget", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});

			if (!res.ok) throw new Error("Failed");

			setFormState({ status: "success" });
		} catch {
			setFormState({ status: "error" });
		}
	}

	if (formState.status === "success") {
		return (
			<div className="mx-auto max-w-[var(--spacing-container-max)] px-[var(--spacing-gutter)] text-center">
				<div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-coastal-teal/10">
					<span className="material-symbols-outlined text-[40px] text-coastal-teal">
						check_circle
					</span>
				</div>
				<h1 className="mt-6 text-[length:var(--text-display-lg)] leading-[var(--text-display-lg--line-height)] font-[var(--text-display-lg--font-weight)] text-deep-navy">
					{presupuestoData.success[currentLocale]}
				</h1>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-10">
			<div className="rounded-xl bg-surface-container-lowest p-8 ambient-shadow">
				<h2 className="text-[length:var(--text-headline-lg)] leading-[var(--text-headline-lg--line-height)] font-[var(--text-headline-lg--font-weight)] text-deep-navy">
					{presupuestoData.sections.contact[currentLocale]}
				</h2>

				<div className="mt-6 grid gap-6 md:grid-cols-2">
					{contactFields.map((field) => (
						<div key={field.id}>
							<label
								htmlFor={`contact-${field.id}`}
								className="mb-1 block text-[length:var(--text-label-md)] text-on-surface-variant"
							>
								{getFieldLabel(field)}
								{field.required && <span className="ml-1 text-error">*</span>}
							</label>
							<input
								id={`contact-${field.id}`}
								type={field.type}
								name={field.id}
								required={field.required}
								className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 text-[length:var(--text-body-md)] outline-none focus:border-coastal-teal focus:ring-2 focus:ring-coastal-teal/20"
							/>
						</div>
					))}
				</div>
			</div>

			<div className="rounded-xl bg-surface-container-lowest p-8 ambient-shadow">
				<h2 className="text-[length:var(--text-headline-lg)] leading-[var(--text-headline-lg--line-height)] font-[var(--text-headline-lg--font-weight)] text-deep-navy">
					{presupuestoData.sections.service[currentLocale]}
				</h2>

				<div className="mt-6 grid gap-6 md:grid-cols-2">
					{serviceFields.map((field) => {
						const isFullWidth = field.type === "textarea" || field.type === "select";

						return (
							<div key={field.id} className={isFullWidth ? "md:col-span-2" : ""}>
								<label
									htmlFor={`service-${field.id}`}
									className="mb-1 block text-[length:var(--text-label-md)] text-on-surface-variant"
								>
									{getFieldLabel(field)}
									{field.required && <span className="ml-1 text-error">*</span>}
								</label>

								{field.type === "select" ? (
									<select
										id={`service-${field.id}`}
										name={field.id}
										required={field.required}
										className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 text-[length:var(--text-body-md)] outline-none focus:border-coastal-teal focus:ring-2 focus:ring-coastal-teal/20"
									>
										<option value="">
											{field.placeholder
												? field.placeholder[currentLocale as keyof typeof field.placeholder] ||
													field.placeholder.es
												: ""}
										</option>
										{presupuestoData.reasons.map((reason) => (
											<option key={reason.id} value={reason.id}>
												{reason.labels[currentLocale as keyof typeof reason.labels] ||
													reason.labels.es}
											</option>
										))}
									</select>
								) : field.type === "textarea" ? (
									<textarea
										id={`service-${field.id}`}
										name={field.id}
										required={field.required}
										rows={5}
										className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 text-[length:var(--text-body-md)] outline-none focus:border-coastal-teal focus:ring-2 focus:ring-coastal-teal/20"
									/>
								) : (
									<input
										id={`service-${field.id}`}
										type={field.type}
										name={field.id}
										required={field.required}
										className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 text-[length:var(--text-body-md)] outline-none focus:border-coastal-teal focus:ring-2 focus:ring-coastal-teal/20"
									/>
								)}
							</div>
						);
					})}
				</div>
			</div>

			<div className="space-y-4">
				<label className="flex items-start gap-3">
					<input type="checkbox" name="consent" required className="mt-1 accent-coastal-teal" />
					<span className="text-[length:var(--text-body-md)] text-on-surface-variant">
						{presupuestoData.consent[currentLocale]}
					</span>
				</label>

				{formState.status === "error" && (
					<p className="rounded-lg bg-error-container px-4 py-3 text-[length:var(--text-body-md)] text-on-error-container">
						Error al enviar. Inténtalo de nuevo.
					</p>
				)}

				<button
					type="submit"
					disabled={formState.status === "submitting"}
					className="w-full rounded-lg bg-energetic-orange px-8 py-4 text-[length:var(--text-button)] leading-[var(--text-button--line-height)] tracking-[var(--text-button--letter-spacing)] font-[var(--text-button--font-weight)] text-white transition hover:brightness-110 disabled:opacity-50 sm:w-auto"
				>
					{formState.status === "submitting" ? "..." : presupuestoData.submit[currentLocale]}
				</button>
			</div>
		</form>
	);
}
