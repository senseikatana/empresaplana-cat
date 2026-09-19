interface MaterialIconProps {
	name: string;
	filled?: boolean;
	className?: string;
}

export function MaterialIcon({ name, filled, className }: MaterialIconProps) {
	return (
		<span
			className={`material-symbols-outlined${filled ? " icon-filled" : ""}${className ? ` ${className}` : ""}`}
		>
			{name}
		</span>
	);
}
