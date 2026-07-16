type HeroSectionProps = {
	overline: string;
	heading: string;
	subheading?: string;
	description: string;
	buttonLabel: string;
	onJoinClick: () => void;
};

export default function HeroSection({
	overline,
	heading,
	subheading,
	description,
	buttonLabel,
	onJoinClick,
}: HeroSectionProps) {
	return (
		<section className="flex w-full flex-col items-center bg-deep-green px-16 py-32">
			<div className="flex max-w-2xl flex-col gap-group">
				<span className="text-caption font-semibold uppercase tracking-wide text-muted-inverse">
					{overline}
				</span>
				<h1 className="text-hero font-bold text-cream">{heading}</h1>
				{subheading && (
					<p className="text-lead font-semibold text-cream">{subheading}</p>
				)}
				<p className="text-lead text-cream/90">{description}</p>
				<button
					type="button"
					onClick={onJoinClick}
					className="flex h-10 w-fit items-center justify-center self-start rounded-full bg-cream px-6 text-label font-medium text-deep-green transition-colors hover:bg-tan"
				>
					{buttonLabel} →
				</button>
			</div>
		</section>
	);
}
