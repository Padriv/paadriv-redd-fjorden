type CtaSectionProps = {
	heading: string;
	description: string;
	buttonLabel: string;
	onJoinClick: () => void;
};

export default function CtaSection({
	heading,
	description,
	buttonLabel,
	onJoinClick,
}: CtaSectionProps) {
	return (
		<section className="flex w-full flex-col items-center bg-background px-16 py-cluster text-ink">
			<div className="flex max-w-2xl flex-col items-center gap-group text-center">
				<h2 className="text-section font-semibold">{heading}</h2>
				<p className="text-body text-copy">{description}</p>
				<button
					type="button"
					onClick={onJoinClick}
					className="flex h-12 items-center justify-center rounded-full bg-deep-green px-8 text-button font-medium text-cream transition-colors hover:bg-green"
				>
					{buttonLabel} →
				</button>
			</div>
		</section>
	);
}
