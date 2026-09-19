interface LegalPageProps {
	title: string;
	children: React.ReactNode;
}

export function LegalPage({ title, children }: LegalPageProps) {
	return (
		<section className="mx-auto max-w-[var(--container-container-max)] px-[var(--spacing-gutter)] py-16">
			<h1 className="text-headline-lg font-bold text-deep-navy">{title}</h1>
			<div className="prose prose-slate mt-8 max-w-none text-body-md text-on-surface-variant">
				{children}
			</div>
		</section>
	);
}
