type HeroSectionProps = {
	overline: string;
	heading: string;
	description: string;
	buttonLabel: string;
	onJoinClick: () => void;
};

export default function HeroSection({
	overline,
	heading,
	description,
	buttonLabel,
	onJoinClick,
}: HeroSectionProps) {
	return (
		<section className="flex w-full flex-col items-center bg-background px-16 py-32">
			<div className="flex max-w-2xl flex-col gap-group">
				<span className="text-caption font-semibold uppercase tracking-wide text-muted">
					{overline}
				</span>
				<h1 className="text-hero font-bold text-ink">{heading}</h1>
				<p className="text-lead text-copy">{description}</p>
				<button
					type="button"
					onClick={onJoinClick}
					className="flex h-10 w-fit items-center justify-center self-start rounded-full bg-deep-green px-6 text-label font-medium text-white transition-colors hover:bg-green"
				>
					{buttonLabel} →
				</button>
			</div>
		</section>
	);
}
