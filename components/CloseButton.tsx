export default function CloseButton({
	onClick,
	label = "Lukk",
	className = "absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full text-copy transition-colors hover:bg-green/10 hover:text-ink",
}: {
	onClick: () => void;
	label?: string;
	className?: string;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-label={label}
			className={className}
		>
			✕
		</button>
	);
}
